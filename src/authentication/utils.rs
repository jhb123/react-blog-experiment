use std::{fs::File, io::Read};
use chrono::{serde::ts_seconds, Duration};
use serde::{Deserialize, Serialize};
use chrono::prelude::*;
use rocket::{request::{Outcome, Request, FromRequest}, http::Status};
use jsonwebtoken::{encode, decode, Header, Validation, EncodingKey, DecodingKey};
use sha2::{Sha256, Digest};
use lazy_static::lazy_static;


const ADMIN_PASSWORD_FILE_NAME: &str = "admin_hash";
const SECRET_KEY_FILE_NAME: &str = "secret_key";

lazy_static! {
    static ref SECRET_KEY: String = read_secret_key();
}


#[derive(Debug)]
pub enum AuthError {
    InvalidPassword,
    ExpiredToken,
    InvalidToken,
    MissingToken,
    DecodeError,
}

impl std::error::Error for AuthError { }

impl std::fmt::Display for AuthError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let message = match self {
            AuthError::InvalidPassword => "Invalid password",
            AuthError::ExpiredToken => "Token has expired",
            AuthError::InvalidToken => "Invalid token",
            AuthError::MissingToken => "Token is missing",
            AuthError::DecodeError => "Error decoding token",
        };
        write!(f, "{}", message)
    }
}

#[derive(Deserialize)]
#[derive(FromForm)]
pub struct Admin<'r> {
    pub r#password: &'r str,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    #[serde(with = "ts_seconds")]
    iat: DateTime<Utc>,
    #[serde(with = "ts_seconds")]
    exp: DateTime<Utc>,
}

impl Default for Claims {
    fn default() -> Self { 
        let issue_time = Utc::now();
        let expire_time = issue_time + Duration::seconds(5);
        Claims {
            iat: issue_time,
            exp: expire_time,
        }
     }
}

fn read_secret_key() -> String {
    let mut f = File::open(SECRET_KEY_FILE_NAME).unwrap();
    let mut secret = String::new();
    let _ = f.read_to_string(&mut secret).unwrap();
    secret
}

pub fn generate_token() -> Result<String, jsonwebtoken::errors::Error> {
    encode(
        &Header::default(),
        &Claims::default(), 
        &EncodingKey::from_secret(SECRET_KEY.as_ref())
    )
}

pub fn validate_password(password: &str) -> Result<(), Box<dyn std::error::Error> > {
    let mut hasher = Sha256::new();
    hasher.update(password);
    let hash = hasher.finalize();

    let mut f = File::open(ADMIN_PASSWORD_FILE_NAME)?;

    let mut buffer = Vec::<u8>::new();
    let _ = f.read_to_end(&mut buffer)?;

    if buffer == hash[..] {Ok(())} else { Err(Box::new(AuthError::InvalidPassword))}
}

pub fn is_valid(token: &str) -> Result<(), AuthError > {
    // expecting a "Bearer $token" type header.
    match decode::<Claims>(
        &token[7..], 
        &DecodingKey::from_secret(SECRET_KEY.as_ref()),
        &Validation::default()
    ) {
        Ok(token) => {
            if token.claims.exp >  Utc::now() { Ok(())} else {Err(AuthError::ExpiredToken)}
        }
        Err(_err) => {
            Err(AuthError::InvalidToken)
        }
    }
}

pub struct Token<'r>(pub &'r str);

#[rocket::async_trait]
impl<'r> FromRequest<'r> for Token<'r> {

    type Error = AuthError;
    
    async fn from_request(req: &'r Request<'_>) -> Outcome<Self, Self::Error> {
        match req.headers().get_one("Authorization") {
            Some(key) =>  {
                match is_valid(key) {
                    Ok(_) =>Outcome::Success(Token(key)),
                    Err(error) => {
                        match error {
                            AuthError::InvalidToken => Outcome::Failure((Status::BadRequest, error)),
                            AuthError::ExpiredToken => Outcome::Failure((Status::Forbidden, error)),
                            _ => Outcome::Failure((Status::InternalServerError, error ))
                        }
                    }
                }
            }
            None => Outcome::Failure((Status::BadRequest, AuthError::MissingToken)),
        }
    }
}
