use std::{
    env,
    fs::{self, File},
    io::Write,
    path::Path,
};

use serde::Deserialize;
use serde_json::Result;

#[derive(Deserialize)]
struct Config {
    mint_fee: String,
    page_limit: u32,
}

fn get_file(file_name: &str) -> File {
    let out_dir = env::var("OUT_DIR").expect("Output dir not defined");
    let dest_path = Path::new(&out_dir).join(file_name);
    File::create(&dest_path).expect("Could not create file")
}

fn main() -> Result<()> {
    println!("cargo:rerun-if-changed=config.json");

    let data = fs::read_to_string("config.json").expect("Unable to read config file");
    let config: Config = serde_json::from_str(data.as_ref())?;

    writeln!(&mut get_file("mint_fee.val"), "{}", config.mint_fee).expect("Could not write");
    writeln!(&mut get_file("page_limit.val"), "{}", config.page_limit).expect("Could not write");

    Ok(())
}
