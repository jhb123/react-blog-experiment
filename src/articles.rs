pub mod routes {
    use rocket::fs::{TempFile, NamedFile};
    use rocket::http::Status;
    use rocket::{get, post, State};
    use uuid::Uuid;
    use std::fs::{self, FileType, File};
    use crate::authentication::utils::Token;
    use crate::Config;

    #[post("/articles/upload", format = "image/*", data = "<file>")]
    pub async fn upload_article_image(
        _token: Token<'_>, mut file: TempFile<'_>, state: &State<Config>
    ) -> (Status, String) {
        
        let img_dir = &state.article_image_dir;
        _ = fs::create_dir_all(img_dir)
            .map_err(|e| (Status::InternalServerError, format!("failed to create {img_dir} with error: {e}") ));

        let id = Uuid::new_v4();
        let ext = file.content_type().unwrap().extension().unwrap();
        let name = format!("{id}.{ext}");
        let path = format!("{img_dir}/{name}");

        match file.persist_to(&path).await {
            Ok(()) => (Status::Accepted, id.to_string()),
            Err(error) => (Status::InternalServerError, format!("failed to save {path} with error: {error}"))
        }
        
    }

    #[get("/articles/image/<name>")]
    pub async fn get_article_image(name: String, state: &State<Config>) -> Option<NamedFile>{
        let img_dir = &state.article_image_dir;
        let path: String = format!("{img_dir}/{name}");
        NamedFile::open(path).await.ok()
    }

}

