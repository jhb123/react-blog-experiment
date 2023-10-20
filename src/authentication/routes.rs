use rocket::http::Status;
use rocket::{get, post};
use rocket::serde::json::Json;
use crate::authentication::utils::*;


#[post("/admin_login", format = "json", data = "<admin>")]
pub fn admin_login(admin: Json<Admin>) -> (Status, String) {
    match validate_password(admin.password) {
        Ok(_) => {
            match generate_token() {
                Ok(token) => (Status::Accepted, token),
                Err(error) => (Status::InternalServerError, error.to_string() )
            }
        },
        Err(_) => (Status::Forbidden, "password not valid".to_string())
    }
}

#[get("/sensitive")]
pub fn sensitive(_token: Token<'_>) -> &'static str {
    "Sensitive data."
}

