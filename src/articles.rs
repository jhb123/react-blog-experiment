pub mod routes {
    use rocket::fs::{TempFile, NamedFile};
    use rocket::http::Status;
    use rocket::{get, post, put};
    use uuid::Uuid;
    use std::fs::{self, FileType, File};
    use std::io;
    use crate::authentication::utils::Token;

    const ARTICLE_IMAGE_DIR: &str = "./articles/images";

    // one of these methods may be better than the other
    #[post("/upload", format = "image/*", data = "<file>")]
    pub async fn post_upload_article_image(_token: Token<'_>, file: TempFile<'_>) -> (Status, String) {
               
        let id = Uuid::new_v4();
        let ext = file.content_type().unwrap().extension().unwrap();
        let name = format!("{id}.{ext}");

        match save_image_file(&name, file).await {
            Ok(()) => (Status::Accepted, id.to_string()),
            Err(error) => (Status::InternalServerError, format!("failed to save {name} with error: {error}"))
        }
    }

    #[put("/image/<name>", format = "image/*", data = "<file>")]
    pub async fn put_upload_article_image(_token: Token<'_>, name: String,file: TempFile<'_>) -> (Status, String) {
        match save_image_file(&name.to_string(), file).await {
            Ok(()) => (Status::Accepted, "uploaded file".to_string()),
            Err(error) => (Status::InternalServerError, format!("failed to put image {name} with {error}"))
        }
    }

    #[get("/image/<name>")]
    pub async fn get_article_image(name: String) -> Option<NamedFile>{
        let path: String = format!("{ARTICLE_IMAGE_DIR}/{name}");
        NamedFile::open(path).await.ok()
    }


    async fn save_image_file( file_name: &String, mut file: TempFile<'_>) -> io::Result<()> {
        let path = format!("{ARTICLE_IMAGE_DIR}/{file_name}");
        fs::create_dir_all(ARTICLE_IMAGE_DIR)?;
        file.persist_to(&path).await   
    }

}

