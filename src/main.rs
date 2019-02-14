#![windows_subsystem = "windows"]

#[macro_use]
extern crate serde_derive;
extern crate serde_json;
extern crate web_view;

use web_view::*;

fn main() {
    web_view::builder()
        .title("Roogle")
        .content(Content::Html(include_str!("../dist/index.html")))
        .size(800, 600)
        .resizable(true)
        .debug(true)
        .user_data(())
        .invoke_handler(|_webview, arg| {
            use Cmd::*;
            match serde_json::from_str(arg).unwrap() {
                Init => println!("this would be the init handler"),
                Log { text } => println!("{}", text),
                OpenUrl { text } => {
                    println!("{}", text);
                    open_url(text)
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
    Log { text: String },
    OpenUrl { text: String },
}

fn open_url(url: String) {
    print!("opening url: {}", url);
    web_view::builder()
        .title("Roogle")
        .content(Content::Url(url))
        .size(800, 600)
        .resizable(true)
        .debug(true)
        .user_data(())
        .invoke_handler(|_webview, arg| {
            use Cmd::*;
            match serde_json::from_str(arg).unwrap() {
                Init => println!("this would be the init handler"),
                Log { text } => println!("{}", text),
                OpenUrl { text } => {
                    println!("{}", text);
                    open_url(text)
                }
            }
            Ok(())
        }).run()
        .unwrap();
}
