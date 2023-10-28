pub mod routes {
    
    use rocket::fairing::AdHoc;
    use rocket::form::Form;
    use rocket::fs::{TempFile, NamedFile};
    use rocket::http::Status;
    use rocket::time::Date;
    use rocket::{get, post, put, routes, FromForm};
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

    #[derive(FromForm)]
    pub struct Upload<'r> {
        files: Vec<TempFile<'r>>,
    }
    
    #[post("/<guid>", data = "<upload>")]
    pub async fn upload_form(_token: Token<'_>, guid: String, mut upload: Form<Upload<'_>>) -> (Status, String){ 
        for file in upload.files.iter_mut(){
            save_article_item(&guid, file).await;
        }
        (Status::Accepted,"uploaded".to_string())
    }

    #[post("/create")]
    async fn create_article(mut db: Connection<ArticlesDb>) -> Result<()>{
        // There is no support for `RETURNING`.
        sqlx::query("INSERT INTO articles (is_published) VALUES (true)")
            .execute(&mut *db)
            .await?;
    
        Ok(())
    }

    async fn save_article_item( guid: &String, file: &mut TempFile<'_>) -> io::Result<()> {
        let name = file.name().ok_or_else(|| io::Error::new(io::ErrorKind::Other, "File has no name"))?;
        let content_type = file.content_type().ok_or_else(|| io::Error::new(io::ErrorKind::Other, "File has no content type"))?;
        let ext = content_type.extension().ok_or_else(|| io::Error::new(io::ErrorKind::Other, "File has no extension"))?;  
        let full_name = [name, &ext.to_string()].join(".");
        let dir = format!("{ARTICLE_DIR}/{guid}");
        fs::create_dir_all(&dir)?;
        file.persist_to( format!("{dir}/{full_name}")).await    
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

