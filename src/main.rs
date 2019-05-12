#![windows_subsystem = "windows"]

extern crate base64;
#[macro_use]
extern crate serde_derive;
extern crate reqwest;
extern crate serde_json;
extern crate url;
extern crate web_view;
extern crate url_open;

use url::Url;
use url_open::UrlOpen;

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
                        Init => {}
                        Log { text } => println!("{}", text),
                        FetchUrl { text } => {
                            fetch_url(webview, text)?;
                        }
                        OpenUrl { text } => {
                            open_url(webview, text);
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
    OpenUrl { text: String },
}

fn fetch_url<T>(wv: &mut WebView<T>, url: String) -> WVResult {
    println!("Retrieving url {}", url);
    let body = reqwest::get(url.as_str())
        .map(|mut x| x.text())
        .unwrap_or(Ok(String::from("failed")))
        .unwrap();

    let result = format!(
        "updateResult['{}']('{}')",
        url,
        base64::encode(body.as_bytes())
    );

    wv.eval(&result)
}

fn open_url<T>(_wv: &mut WebView<T>, url: String) {
    println!("Opening url {}", url);
    Url::parse(url).unwrap().open();
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
