#![windows_subsystem = "windows"]

#[macro_use]
extern crate serde_derive;
extern crate reqwest;
extern crate serde_json;
extern crate url;
extern crate web_view;

use url::form_urlencoded::byte_serialize;
use web_view::*;

fn main() {
    web_view::builder()
        .title("Roogle")
        .content(Content::Html(include_str!("../dist/index.html")))
        .size(800, 600)
        .resizable(true)
        .debug(true)
        .user_data(())
        .invoke_handler(|webview, arg| {
            use Cmd::*;
            match serde_json::from_str(arg).unwrap() {
                Init => println!("this would be the init handler"),
                Log { text } => println!("{}", text),
                FetchUrl { text } => {
                    println!("open_url( {} )", text);
                    fetch_url(webview, text)?;
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
    FetchUrl { text: String },
}

fn fetch_url<T>(wv: &mut WebView<T>, url: String) -> WVResult {
    println!("should retrieve url {}", url);
    let body = reqwest::get(&format!("{}", url)).unwrap().text().unwrap();
    let encoded: String = byte_serialize(body.as_bytes()).collect();
    let result = format!("updateResult('{}')", encoded);

    println!("result: {}", result);

    wv.eval(&result)
}
