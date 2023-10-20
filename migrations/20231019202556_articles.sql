CREATE TABLE IF NOT EXISTS articles 
(
    article_id int NOT NULL AUTO_INCREMENT,
    creation_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    published_date DATETIME,
    is_published BOOLEAN,
    primary key (article_id)
);