#[macro_use] extern crate rocket;
use std::io::prelude::*;
use std::fs::File;
use std::path::{PathBuf, Path};
use rocket::fs::NamedFile;
use rocket::response::content;
use crate::authentication::routes::{admin_login, sensitive};

pub mod authentication;


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



