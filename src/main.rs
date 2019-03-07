#![windows_subsystem = "windows"]

extern crate base64;
#[macro_use]
extern crate serde_derive;
extern crate reqwest;
extern crate scraper;
extern crate serde_json;
extern crate url;
extern crate web_view;

use scraper::{Html, Selector};
use web_view::*;

fn main() {
    start_web_server()
        .map(|server| {
            web_view::builder()
                .title("Roogle")
                .content(Content::Url(format!(
                    "http://{}:{}/index.html",
                    server.domain, server.port
                ))).size(800, 600)
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
        }).unwrap();
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
    let resource = reqwest::get(&format!("{}", url)).unwrap().text().unwrap();
    let html = Html::parse_fragment(&resource);
    let ol_selector = Selector::parse("#search ol").unwrap();
    let div_selector = Selector::parse("div").unwrap();
    let list = html.select(&ol_selector).next().unwrap();
    let mut list_elements = "".to_owned();
    for element in list.select(&div_selector) {
        let encoded_part = base64::encode(element.inner_html().as_bytes());
        list_elements = list_elements + "\"" + encoded_part.as_str() + "\",";
    }
    let result = format!("updateResult['{}']([{}])", url, list_elements);

    wv.eval(&result)
}

struct Server {
    domain: String,
    port: u16,
}

fn start_web_server() -> Result<Server, &'static str> {
    Ok(Server {
        domain: String::from("localhost"),
        port: 1234,
    })
}
