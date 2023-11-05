pub mod routes {
    
    use rocket::fairing::{AdHoc, self};
    use rocket::form::Form;
    use rocket::fs::{TempFile, NamedFile};
    use rocket::http::Status;
    use rocket::response::status::NotFound;
    use rocket::serde::json::Json;
    use rocket::{post, routes, FromForm, get, Rocket, Build, error, delete};
    use rocket_db_pools::{sqlx, Database, Connection};
    use rocket::serde::{Serialize, Deserialize};
    use markdown::{to_html_with_options, CompileOptions, Options};
    use kuchiki::{traits::*, NodeRef};
    use ::sqlx::migrate;
    use sqlx::QueryBuilder;
    use sqlx::types::chrono::DateTime;
    //use sqlx::mysql::MySqlPool;
    use std::fs::{self,File};
    use std::io;
    use crate::authentication::utils::Token;

    type Result<T, E = rocket::response::Debug<sqlx::Error>> = std::result::Result<T, E>;

    const ARTICLE_DIR: &str = "./articles";

    enum DatabaseErrors {
        NoUpdateParameters,
        BadQuery(String),
    }

    #[derive(Database)]
    #[database("sqlx")]
    struct ArticlesDb(sqlx::mysql::MySqlPool);

    
    #[derive(Debug, Clone, Deserialize, Serialize, sqlx::FromRow)]
    #[serde(crate = "rocket::serde")]
    struct ArticleMetadata {
        article_id: i64,
        #[serde(skip_serializing_if = "Option::is_none")]
        creation_date: Option<DateTime<chrono::Utc>>,
        #[serde(skip_serializing_if = "Option::is_none")]
        published_date: Option<DateTime<chrono::Utc>>,
        #[serde(skip_serializing_if = "Option::is_none")]
        is_published: Option<bool>,
        #[serde(skip_serializing_if = "Option::is_none")]
        visits: Option<i64>,
        #[serde(skip_serializing_if = "Option::is_none")]
        title: Option<String>,
        #[serde(skip_serializing_if = "Option::is_none")]
        title_image: Option<String>,
        #[serde(skip_serializing_if = "Option::is_none")]
        blurb: Option<String>,
    }

    #[derive(FromForm)]
    struct Upload<'r> {
        article_id: Option<i64>,
        title: Option<String>,
        title_image: Option<String>,
        blurb: Option<String>,
        files: Vec<TempFile<'r>>,
    }

    // #[derive(FromData)]
    // struct PublishRequest {
    //     id:  u64,
    //     set_published: bool,
    // }
    
    #[post("/upload", data = "<upload>")]
    async fn upload_form(_token: Token<'_>, mut upload: Form<Upload<'_>>, db: Connection<ArticlesDb>) -> (Status, String){ 

        
        let article_id = match upload.article_id {
            Some(x) => {
                // update database
                match update_article(&upload, db).await {
                    Ok(_) => x.to_string(),
                    Err(DatabaseErrors::BadQuery(msg)) =>  return (Status::InternalServerError, msg),
                    Err(DatabaseErrors::NoUpdateParameters) =>  return (Status::BadRequest, "Must include at least a title, title image or blurb".to_string())
                }
                
            },
            None => {
                match create_article(&upload, db).await {
                    Ok(primary_key) => primary_key.to_string(),
                    Err(error) => return (Status::InternalServerError,error.0.to_string()),
                }
            },
        };

        // Save each file that is included with the form. If its markdown, generate a html
        // file as well
        for file in upload.files.iter_mut(){
            if let Some(content_type) = file.content_type() {
                if content_type.is_markdown() {
                    if let Err(error) = generate_article_html(&article_id, file){
                        return (Status::InternalServerError,error.to_string())
                    }
                }
                if let Err(error) = save_article_item(&article_id, file).await {
                    return (Status::InternalServerError,error.to_string())
                };
            } else {
                return (Status::BadRequest,"Missing content type for upload".to_string())
            }
        }
        (Status::Accepted,"uploaded".to_string())
    }

    #[get("/list")]
    async fn get_article_list(mut db: Connection<ArticlesDb>) -> Result<Json<Vec<ArticleMetadata>>> { 
        let res  = sqlx::query_as::<_, ArticleMetadata>("SELECT * FROM articles").fetch_all(&mut *db).await?;
        Ok(Json(res))
    }

    #[get("/publish?<article_id>&<is_published>")]
    async fn publish(_token: Token<'_>, mut db: Connection<ArticlesDb>, article_id: i64, is_published: bool) -> Result<String> { 

        let time  = if is_published { Some(chrono::Utc::now())} else {None};

        let _ = sqlx::query("UPDATE articles SET is_published = ?, published_date = ? WHERE article_id = ?")
            .bind(is_published)
            .bind(time)
            .bind(article_id)
            .execute(&mut *db)
            .await?;

        Ok(format!("set article {0} to published={1}",article_id, is_published))
    }

    #[delete("/delete?<article_id>")]
    async fn delete_stuff(_token: Token<'_>, mut db: Connection<ArticlesDb>, article_id: i64)-> Result<()> {
        let _ = sqlx::query("DELETE FROM articles WHERE article_id = ?")
        .bind(article_id)
        .execute(&mut *db)
        .await?;
    
        let dir: String = format!("{ARTICLE_DIR}/{article_id}");

        let _ = fs::remove_dir_all(dir).map_err(|e| NotFound(e.to_string()));
        Ok(())
    }

    #[get("/<article_id>")]
    fn get_article(article_id: &str) -> (Status, String) { 
        let path = format!("{ARTICLE_DIR}/{article_id}/generated.html");
        match fs::read_to_string(path) {
            Ok(html) => (Status::Accepted,html),
            Err(_) => (Status::NotFound, "Article HTML is missing".to_string())
        }
    }

    #[get("/<article_id>/image/<name>")]
    async fn get_image(article_id: &str, name: &str) -> Result<NamedFile, NotFound<String>> { 
        let path = format!("{ARTICLE_DIR}/{article_id}/{name}");
        NamedFile::open(&path).await.map_err(|e| NotFound(e.to_string()))
    }

    async fn update_article(upload: &Form<Upload<'_>>, mut db: Connection<ArticlesDb>) -> Result<(), DatabaseErrors>{
        // let null_str = "Null".to_string();
        let title = upload.title.as_ref();
        let title_image = upload.title_image.as_ref();
        let blurb = upload.blurb.as_ref();
        let article_id = upload.article_id.unwrap();

        if title.is_none() && title_image.is_none() && blurb.is_none() {return Err(DatabaseErrors::NoUpdateParameters);}

        let mut query_builder = QueryBuilder::new("UPDATE articles SET ");

        // OK, this isn't the most elegant thing ever. I could have used Diesel for this
        // If I ever need to have this functionality somewhere else, I'll make it into
        // its own function.
        let mut enable_seperator = false;
        if let Some(title) = title {
            enable_seperator = true;
            query_builder.push("title =  ");
            query_builder.push_bind(title);
        }        
        if let Some(title_image) = title_image {
            if enable_seperator {
                query_builder.push(", ");
            } else { enable_seperator = true;};
            query_builder.push("title_image = ");
            query_builder.push_bind(title_image);
        }
        if let Some(blurb) = blurb {
            if enable_seperator {
                query_builder.push(", ");
            } // else { enable_seperator = true;};
            query_builder.push("blurb = ");
            query_builder.push_bind(blurb);
        }

        query_builder.push(" WHERE article_id = ");
        query_builder.push_bind(article_id);


        match query_builder.build().execute(&mut *db).await {
            Ok(_) => Ok(()),
            Err(error) => Err(DatabaseErrors::BadQuery(error.to_string()))
        }

    }

    async fn create_article(upload: &Form<Upload<'_>>, mut db: Connection<ArticlesDb>) -> Result<u64>{

        let query_result = sqlx::query("INSERT INTO articles 
        (is_published, visits, title, title_image, blurb) 
        VALUES (false, 0, ?, ?, ?)")
            .bind(&upload.title)
            .bind(&upload.title_image)
            .bind(&upload.blurb)
            .execute(&mut *db)
            .await?;

        Ok(query_result.last_insert_id())
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

    fn generate_article_html( guid: &String, file: &mut TempFile<'_>) -> Result<(), Box<dyn std::error::Error>> {
        
        // Read the markdown to a string
        let markdown_path = file.path().ok_or_else(|| io::Error::new(io::ErrorKind::NotFound, "Markdown file not found"))?;
        let markdown = fs::read_to_string(markdown_path)?;
        
        // Convert the markdown string to HTML string. The dangerous part here
        // is the markdown can have html in it, so I could put a malicous script
        // in my posts. The reason for dangerously parsing the markdown is so that
        // I can specify use <img> tags in the markdown. I guess I could add
        // a thing which removes <script> tags.
        let html = to_html_with_options(&markdown,
            &Options {
            compile: CompileOptions {
              allow_dangerous_html: true,
              ..CompileOptions::default()
            },
            ..Options::default()
        }).unwrap(); //this unwrap is safe according to the documentation 

        // Parse the html string to tree
        let document = kuchiki::parse_html().one(html);

        modify_dom_img_src(&document, &guid);
        
        // serialise the modified DOM to a html file
        let mut result = Vec::new();
        document.serialize(&mut result)?;
        let modified_html = String::from_utf8(result)?;
        let html_path = format!("{ARTICLE_DIR}/{guid}/generated.html");
        _ = File::create(&html_path)?;
        fs::write(html_path, modified_html)?;
 
        Ok(())   
    }

    fn modify_dom_img_src(document: &NodeRef, guid: &String){
        // this function is for parsing the <img src="..."> in a html document and replacing 
        // the src with valid urls
        if let Ok(img_nodes) = document.select("img"){
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
        }
    }

    async fn run_migrations(rocket: Rocket<Build>) -> fairing::Result {
        match ArticlesDb::fetch(&rocket) {
            Some(db) => match migrate!("db/migrations").run(&**db).await {
                Ok(_) => Ok(rocket),
                Err(e) => {
                    error!("Failed to initialize SQLx database: {}", e);
                    Err(rocket)
                }
            }
            None => Err(rocket),
        }
    }

    //"db/sqlx/db.mysql"
    pub fn stage() -> AdHoc {
        AdHoc::on_ignite("SQLx Stage", |rocket| async {
            rocket.attach(ArticlesDb::init())
                .attach(AdHoc::try_on_ignite("SQLx Migrations", run_migrations))
                .mount("/articles", routes![upload_form, get_article, get_image, get_article_list, publish, delete_stuff])
        })
    }

}

