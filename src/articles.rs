pub mod routes {
    
    use rocket::fairing::AdHoc;
    use rocket::form::Form;
    use rocket::fs::{TempFile, NamedFile};
    use rocket::http::Status;
    use rocket::response::status::NotFound;
    use rocket::{post, put, routes, FromForm, get};
    use rocket_db_pools::{sqlx, Database, Connection};
    use rocket::serde::{Serialize, Deserialize};
    use markdown::{to_html_with_options, CompileOptions, Options};
    use kuchiki::traits::*;

    //use sqlx::mysql::MySqlPool;
    use std::fs::{self,File};
    use std::io;    
    use crate::authentication::utils::Token;

    type Result<T, E = rocket::response::Debug<sqlx::Error>> = std::result::Result<T, E>;

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
        id: String,
        files: Vec<TempFile<'r>>,
    }
    
    #[put("/upload", data = "<upload>")]
    pub async fn upload_form(_token: Token<'_>, mut upload: Form<Upload<'_>>) -> (Status, String){ 
        let article_id = upload.id.to_owned();

        // Save each file that is included with the form. If its markdown, generate a html
        // file as well
        for file in upload.files.iter_mut(){
            if file.content_type().unwrap().is_markdown() {
                if let Err(error) = generate_article_html(&article_id, file){
                    return (Status::InternalServerError,error.to_string())
                }
            }
            if let Err(error) = save_article_item(&article_id, file).await {
                return (Status::InternalServerError,error.to_string())
            };
        }
        (Status::Accepted,"uploaded".to_string())
    }


    #[get("/<article_id>")]
    pub fn get_article(_token: Token<'_>, article_id: &str) -> (Status, String) { 
        let path = format!("{ARTICLE_DIR}/{article_id}/generated.html");
        match fs::read_to_string(path) {
            Ok(html) => (Status::Accepted,html),
            Err(_) => (Status::NotFound, "Article HTML is missing".to_string())
        }
    }

    #[get("/<article_id>/image/<name>")]
    pub async fn get_image(_token: Token<'_>, article_id: &str, name: &str) -> Result<NamedFile, NotFound<String>> { 
        let path = format!("{ARTICLE_DIR}/{article_id}/{name}");
        NamedFile::open(&path).await.map_err(|e| NotFound(e.to_string()))
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
        let content_type = file
            .content_type()
            .ok_or_else(|| io::Error::new(io::ErrorKind::Other, "File has no content type"))?
            .to_owned();
        let ext = content_type.extension().ok_or_else(|| io::Error::new(io::ErrorKind::Other, "File has no extension"))?;  
        let full_name = [name, &ext.to_string()].join(".");
        let dir = format!("{ARTICLE_DIR}/{guid}");
        fs::create_dir_all(&dir)?;
        file.persist_to( format!("{dir}/{full_name}")).await?;
        Ok(()) 
    }

    fn generate_article_html( guid: &String, file: &mut TempFile<'_>) -> io::Result<()> {
        
        // Read the markdown to a string
        let markdown = fs::read_to_string(file.path().unwrap()).unwrap();
        
        // Convert the markdown string to HTML string
        let html = to_html_with_options(&markdown,
            &Options {
            compile: CompileOptions {
              allow_dangerous_html: true,
              ..CompileOptions::default()
            },
            ..Options::default()
        }).unwrap(); //this is safe according to the documentation 

        // Parse the html string to tree
        let document = kuchiki::parse_html().one(html);

        // Extract the <img /> nodes and replace the src with valid ones. Its expected that the
        // uploaded markdown will reference images in its local directory. These are given
        // the prepended the path this server uses to look for files.
        let img_nodes = document.select("img").unwrap();
        for node in img_nodes {
            let mut attrs =  node.attributes.borrow_mut();
            match attrs.get_mut("src") {
                Some(src) => {
                    let trimmed = src.trim();
                    let new_src = match trimmed {
                        x if x.starts_with("https://") => x.to_string(),
                        x if x.starts_with("http://") => x.to_string(),
                        x if x.starts_with("./") => {
                            format!("/articles/{guid}/image/").to_owned() + &x[2..]
                        },
                        x => format!("/articles/{guid}/image/").to_owned() + x
                    };
                    src.replace_range(..,&new_src);
                }
                None => {}
            }        
        }

        let mut result = Vec::new();
        document.serialize(&mut result).expect("Failed to serialize document");
        let modified_html = String::from_utf8(result).expect("Invalid UTF-8 sequence");

        let path = format!("{ARTICLE_DIR}/{guid}/generated.html");
        _ = File::create(&path)?;
        fs::write(path, modified_html)?;
 
        Ok(())   
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

