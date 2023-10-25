pub mod routes {
    
    use rocket::fairing::AdHoc;
    use rocket::fs::{TempFile, NamedFile};
    use rocket::http::Status;
    use rocket::time::Date;
    use rocket::{get, post, put, routes};
    use rocket_db_pools::{sqlx, Database, Connection};
    use rocket::response::status::Created;
    use rocket::serde::{Serialize, Deserialize, json::Json};
    use uuid::Uuid;
    //use sqlx::mysql::MySqlPool;
    use std::fs::{self};
    use std::io;    
    use crate::authentication::utils::Token;

    type Result<T, E = rocket::response::Debug<sqlx::Error>> = std::result::Result<T, E>;

    const ARTICLE_IMAGE_DIR: &str = "./articles/images";
    const ARTICLE_DIR: &str = "./articles";
    
    #[derive(Database)]
    #[database("sqlx")]
    struct ArticlesDb(sqlx::mysql::MySqlPool);

    #[derive(Debug, Clone, Deserialize, Serialize)]
    #[serde(crate = "rocket::serde")]
    struct Article {
        #[serde(skip_deserializing, skip_serializing_if = "Option::is_none")]
        id: Option<i64>,
        creation_date: Option<String>,
        published_date: Option<String>,
        is_published: bool,
        title: Option<String>,
        blurb: Option<String>,
    }

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


    #[post("/create")]
    async fn create_article(mut db: Connection<ArticlesDb>) -> Result<()>{
        // There is no support for `RETURNING`.
        sqlx::query("INSERT INTO articles (is_published) VALUES (true)")
            .execute(&mut *db)
            .await?;
    
        Ok(())
    }

    async fn save_image_file( file_name: &String, mut file: TempFile<'_>) -> io::Result<()> {
        let path = format!("{ARTICLE_IMAGE_DIR}/{file_name}");
        fs::create_dir_all(ARTICLE_IMAGE_DIR)?;
        file.persist_to(&path).await   
    }

    async fn save_article( file_name: &String, mut file: TempFile<'_>) -> io::Result<()> {
        let path = format!("{ARTICLE_DIR}/{file_name}");
        fs::create_dir_all(ARTICLE_DIR)?;
        file.persist_to(&path).await   
    }

    //"db/sqlx/db.mysql"
    pub fn stage() -> AdHoc {
        AdHoc::on_ignite("SQLx Stage", |rocket| async {
            rocket.attach(ArticlesDb::init())
                //.attach(AdHoc::try_on_ignite("SQLx Migrations", run_migrations))
                .mount("/sqlx", routes![create_article])
        })
    }
}

