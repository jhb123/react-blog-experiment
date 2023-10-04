#[macro_use] extern crate rocket;
use std::io::prelude::*;
use std::fs::File;
use std::path::{PathBuf, Path};
use jsonwebtoken::{encode, decode, Header, Validation, EncodingKey, DecodingKey};
use rocket::fs::NamedFile;
use rocket::http::Status;
use rocket::request::{self, Outcome, Request, FromRequest};
use rocket::response::content;
use rocket::serde::json::Json;
use serde::{Deserialize, Serialize};
use sha2::{Sha256, Digest};
use chrono::prelude::*;
use chrono::serde::ts_seconds;
use chrono::Duration;
use lazy_static::lazy_static;


// this lets me set a static variable that is computed at run time.
lazy_static! {
    static ref SECRET_KEY: String = read_secret_key();
}

#[launch]
fn rocket() -> _ {

    
    rocket::build()
        .mount("/", routes![index,react_build, admin_login, sensitive])
}

#[get("/")]
fn index() -> content::RawHtml<String> {
    let base_path = Path::new("./frontend/build");
    let index_path = base_path.join("index.html");
    let mut file = File::open(index_path).expect("Unable to open the file");
    let mut contents = String::new();
    file.read_to_string(&mut contents).expect("Unable to read the file");
    content::RawHtml(contents)

}

#[get("/<path..>")]
async fn react_build(path: PathBuf) -> Option<NamedFile> {
    let base_path = Path::new("./frontend/build");
    let full_path = base_path.join(path);
    NamedFile::open(full_path).await.ok()
}



#[post("/admin_login", format = "json", data = "<admin>")]
fn admin_login(admin: Json<Admin>) -> (Status, String) {
    let mut hasher = Sha256::new();
    hasher.update(admin.password);
    let hash = hasher.finalize();

    let mut f = File::open("admin_hash").unwrap();

    let mut buffer = Vec::<u8>::new();
    let _ = f.read_to_end(&mut buffer).unwrap();


    if buffer == hash[..] {

        let issue_time = Utc::now();
        let expire_time = issue_time + Duration::seconds(5);
        let my_claims = Claims {
            iat: issue_time,
            exp: expire_time,
        };
        let token = encode(&Header::default(), &my_claims, &EncodingKey::from_secret(SECRET_KEY.as_ref())).unwrap();
        (Status::Accepted, token)
        
    } else {
        (Status::Forbidden, "password not valid".to_string())
    }
}

#[derive(FromForm)]
#[derive(Deserialize)]
struct Admin<'r> {
    r#password: &'r str,
}

#[derive(Debug, Serialize, Deserialize)]
struct Claims {
    #[serde(with = "ts_seconds")]
    iat: DateTime<Utc>,
    #[serde(with = "ts_seconds")]
    exp: DateTime<Utc>,
}

struct ApiKey<'r>(&'r str);

#[derive(Debug)]
enum ApiKeyError {
    Missing,
    Invalid,
}

#[rocket::async_trait]
impl<'r> FromRequest<'r> for ApiKey<'r> {
    
    type Error = ApiKeyError;

    async fn from_request(req: &'r Request<'_>) -> Outcome<Self, Self::Error> {
        /// Returns true if `key` is a valid JWT token.
        fn is_valid(token: &str) -> bool {
            // expecting a "Bearer $token" type header.
            match decode::<Claims>(&token[7..], &DecodingKey::from_secret(SECRET_KEY.as_ref()), &Validation::default()) {
                Ok(token) => token.claims.exp >  Utc::now(),
                Err(_) => false,
            }            
        }
        
        match req.headers().get_one("Authorization") {
            None => Outcome::Failure((Status::BadRequest, ApiKeyError::Missing)),
            Some(key) if is_valid(key) => Outcome::Success(ApiKey(key)),
            Some(_) => Outcome::Failure((Status::Forbidden, ApiKeyError::Invalid)),
        }
    }
}

#[get("/sensitive")]
fn sensitive(key: ApiKey<'_>) -> &'static str {
    "Sensitive data."
}

fn read_secret_key() -> String {
    let mut f = File::open("secret_key").unwrap();
    let mut secret = String::new();
    let _ = f.read_to_string(&mut secret).unwrap();
    secret
}