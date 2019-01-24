#![windows_subsystem = "windows"]

extern crate azul;

use azul::prelude::*;
#[cfg(debug_assertions)]
use std::time::Duration;

struct MyDataModel;

impl Layout for MyDataModel {
    fn layout(&self, info: WindowInfo<Self>) -> Dom<Self> {
        Dom::div().with_id("wrapper")
            .with_child(Dom::label("Hello123").with_id("red"))
            .with_child(Dom::div().with_id("sub-wrapper")
                .with_child(Dom::div().with_id("yellow")
                    .with_child(Dom::div().with_id("orange-1"))
                    .with_child(Dom::div().with_id("orange-2"))
                )
                .with_child(Dom::div().with_id("grey"))
            )
            .with_child((0..50).map(|i| Dom::label(format!("{}", i))).collect::<Dom<Self>>().with_id("rows"))
    }
}

fn main() {

    macro_rules! CSS_PATH { () => (concat!(env!("CARGO_MANIFEST_DIR"), "/src/main.css")) }

    let mut app = App::new(MyDataModel, AppConfig::default());

    #[cfg(debug_assertions)]
    let window = Window::new_hot_reload(WindowCreateOptions::default(), css::hot_reload(CSS_PATH!(), Duration::from_millis(500))).unwrap();

    #[cfg(not(debug_assertions))]
    let window = Window::new(WindowCreateOptions::default(), css::from_str(include_str!(CSS_PATH!())).unwrap()).unwrap();

    app.run(window).unwrap();
}
