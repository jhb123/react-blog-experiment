# My website project

This website uses React with Material UI. The backend is implemented with Rust. It features

- A rich text editor for writing blog posts

## Notes
Run the project in locally by running this command in the frontend directory:
```
npm run build-all
```
Run just the server with
```
cargo run --bin server
```
Use the administration tool with
```
cargo run --bin admin
```
Set up the MySQL database with:
```console
docker pull mysql
```
Start the MySQL server with (change the password from `root` in this command):
```console
docker run --name blog-db -p 3306:3306 -e MYSQL_ROOT_PASSWORD=root -d mysql
```
See information about the MySQL container with:
```console
docker ps
```
Make sure you have the sqlx-cli installed
```
cargo install sqlx-cli
```
create an environment variable
```
export DATABASE_URL="mysql://root:root@localhost:3306/blog-db"
```
create the database
```
sqlx db create
```
Run the command
```
sqlx migrate add articles
```