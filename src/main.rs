#![windows_subsystem = "windows"]

#[macro_use]
extern crate serde_derive;
extern crate serde_json;
extern crate web_view;

use std::thread::sleep_ms;
use web_view::*;

fn main() {
    web_view::builder()
        .title("Roogle")
        .content(Content::Html(include_str!("../dist/index.html")))
        // .content(Content::Url("https://www.wikipedia.org/"))
        .size(800, 600)
        .resizable(true)
        .debug(true)
        .user_data(())
        .invoke_handler(|_webview, arg| {
            use Cmd::*;
            match serde_json::from_str(arg).unwrap() {
                Init => println!("this would be the init handler"),
                Log { text } => println!("{}", text),
                CreateTmpFile { text } => println!("create {}", text),
                ReadPdf { text } => println!("read {}", text),
                SplitText { text } => println!("split {}", text),
                RemoveTmpFile { text } => println!("remove {}", text),
                LogLong { text } => {
                    sleep_ms(15000);
                    println!("{}", text)
                }
            }
            Ok(())
        }).run()
        .unwrap();
}

#[derive(Deserialize)]
#[serde(tag = "cmd", rename_all = "camelCase")]
pub enum Cmd {
    Init,
    CreateTmpFile { text: String },
    ReadPdf { text: String },
    SplitText { text: String },
    RemoveTmpFile { text: String },
    Log { text: String },
    LogLong { text: String },
}
