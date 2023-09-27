use std::fs::File;
use std::io::Write;
use base64ct::{Base64, Encoding};
use dialoguer::{theme::ColorfulTheme, Select, Password};
use sha2::{Sha256, Digest};

fn main() {
    let selections = &[
        "Set admin password",
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
            1=> create_database(),
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

fn create_database() -> std::io::Result<()> {
    println!("initialising database");
    Ok(())
}