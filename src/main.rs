#![windows_subsystem = "windows"]

extern crate base64;
#[macro_use]
extern crate serde_derive;
extern crate serde_json;
extern crate web_view;
extern crate webbrowser;

use web_view::*;

fn main() {
    start_web_server()
        .map(|server| {
            web_view::builder()
                .title("Roogle")
                .content(Content::Url(format!(
                    "http://{}:{}/index.html",
                    server.domain, server.port
                )))
                .size(800, 600)
                .resizable(true)
                .debug(true)
                .user_data(())
                .invoke_handler(|webview, arg| {
                    use Cmd::*;
                    match serde_json::from_str(arg).unwrap() {
                        Init => {}
                        Log { text } => println!("{}", text),
                        OpenUrl { text } => {
                            open_url(webview, text);
                        }
                    }
                    Ok(())
                })
                .run()
                .unwrap();
        })
        .unwrap();
}

#[derive(Deserialize)]
#[serde(tag = "cmd", rename_all = "camelCase")]
pub enum Cmd {
    Init,
    Log { text: String },
    OpenUrl { text: String },
}

fn open_url<T>(_wv: &mut WebView<T>, url: String) {
    webbrowser::open(url.as_str()).unwrap();
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
