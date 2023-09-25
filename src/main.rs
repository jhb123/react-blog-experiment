#[macro_use] extern crate rocket;
use std::io::prelude::*;
use std::fs::File;
use std::path::{PathBuf, Path};
use rocket::form::Form;
use rocket::fs::NamedFile;
use rocket::http::{ContentType, Status};
use rocket::response::{content, Redirect};
use rocket::serde::json::Json;
use serde::Deserialize;

const base_path: &'static str = "/Users/josephbriggs/repos/rocket-blog/frontend/build";

#[get("/")]
fn index() -> content::RawHtml<String> {
    let mut file = File::open(base_path.to_owned() + "/index.html").expect("Unable to open the file");
    let mut contents = String::new();
    file.read_to_string(&mut contents).expect("Unable to read the file");
    content::RawHtml(contents)

}

#[get("/<path..>")]
async fn react_build(path: PathBuf) -> Option<NamedFile> {
    NamedFile::open(Path::new(base_path).join(path)).await.ok()
}

#[derive(FromForm)]
#[derive(Deserialize)]
struct Admin<'r> {
    r#password: &'r str,
}

#[post("/admin_login", format = "json", data = "<admin>")]
fn admin_login(admin: Json<Admin>) -> Status {
    if admin.password == "foo" {
        Status::Accepted
    } else {
        Status::Forbidden
    }
}

#[launch]
fn rocket() -> _ {
    rocket::build().mount("/", routes![index,react_build, admin_login])
}