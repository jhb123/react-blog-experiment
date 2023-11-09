CREATE TABLE IF NOT EXISTS articles 
(
    article_id INT NOT NULL AUTO_INCREMENT,
    creation_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    published_date DATETIME,
    is_published BOOLEAN,
    visits INT,
    title TEXT,
    title_image TEXT,
    blurb TEXT,
    primary key (article_id)
);