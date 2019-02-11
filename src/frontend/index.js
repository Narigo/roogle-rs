import "babel-polyfill";
import pdfJsWorker from "pdfjs-dist/build/pdf.worker";
import React from "react";
import ReactDom from "react-dom";
import { App } from "./component/app";

(typeof window !== "undefined" ? window : {}).pdfjsWorker = pdfJsWorker;

const $root = document.getElementById("root");

ReactDom.render(<App />, $root);

window.external.invoke(JSON.stringify({ cmd: "init" }));
