use std::fs::File;
use std::io::Write;
use dialoguer::{theme::ColorfulTheme, Select, Password};
use rand::{Rng, distributions::Alphanumeric};
use sha2::{Sha256, Digest};

fn main() {
    let selections = &[
        "Set admin password",
        "Generate secret key",
        "Initialise database",
    ];

    let selection = Select::with_theme(&ColorfulTheme::default())
        .with_prompt("Choose task")
        .default(0)
        .items(&selections[..])
        .interact_opt()
        .unwrap();

    if let Some(selection) = selection {
        let _ = match selection {
            0=> set_admin_password(),
            1=> create_secret_key(),
            2=> create_database(),
            _ => Ok(())
        };
    } else {
        println!("Exiting");
    }
   
}

fn set_admin_password() -> std::io::Result<()> {
    let password = Password::with_theme(&ColorfulTheme::default())
        .with_prompt("Password")
        .with_confirmation("Repeat password", "Error: the passwords don't match.")
        .interact()
        .unwrap();

    let mut hasher = Sha256::new();
    hasher.update(password);
    let hash = hasher.finalize();
    // let encoded = Base64::encode_string(&hash);
    let mut file = File::create("admin_hash")?;
    file.write_all(&hash)?;
    Ok(())
    
}

fn create_secret_key() -> std::io::Result<()> {

    let secret: String = rand::thread_rng()
    .sample_iter(&Alphanumeric)
    .take(100)
    .map(char::from)
    .collect();

    let mut file = File::create("secret_key")?;
    file.write(secret.as_bytes())?;
    Ok(())
}

#[tokio::main]
async fn create_database() -> std::io::Result<()> {
   Ok(())
}