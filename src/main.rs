#![windows_subsystem = "windows"]

extern crate azul;

use azul::prelude::*;
#[cfg(debug_assertions)]
use std::time::Duration;

struct MyDataModel;

impl Layout for MyDataModel {
    fn layout(&self, _info: WindowInfo<Self>) -> Dom<Self> {
        Dom::div().with_id("main").with_child(
            Dom::div()
                .with_id("head")
                .with_child(Dom::label("Welcome to Roogle")),
        )
    }
}

fn main() {
    macro_rules! CSS_PATH {
        () => {
            concat!(env!("CARGO_MANIFEST_DIR"), "/src/main.css")
        };
    }

    let app = App::new(MyDataModel, AppConfig::default());

    #[cfg(debug_assertions)]
    let window = Window::new_hot_reload(
        WindowCreateOptions::default(),
        css::hot_reload(CSS_PATH!(), Duration::from_millis(500)),
    ).unwrap();

    #[cfg(not(debug_assertions))]
    let window = Window::new(
        WindowCreateOptions::default(),
        css::from_str(include_str!(CSS_PATH!())).unwrap(),
    ).unwrap();

    app.run(window).unwrap();
}
