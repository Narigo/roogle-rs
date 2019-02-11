import React, { useState } from "react";
import cn from "classnames";
import style from "./dropfile.scss";
import useRustCommand from "../../hooks/use-rust-command";

const Dropfile = ({ onDrop }) => {
  const [dragOver, setDragOver] = useState(false);
  const log = useRustCommand("log");
  console.log("dropfile render");
  return (
    <div
      className={cn(style.root, dragOver && style.dragOver)}
      onClick={() => log("something clicked.")}
      onDragOver={event => {
        event.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={event => {
        event.preventDefault();
        setDragOver(false);
      }}
      onDrop={event => {
        event.preventDefault();
        const files = [];
        if (event.dataTransfer.items) {
          for (let i = 0; i < event.dataTransfer.items.length; i++) {
            if (event.dataTransfer.items[i].kind === "file") {
              files.push(event.dataTransfer.items[i].getAsFile());
            }
          }
        } else {
          for (let i = 0; i < event.dataTransfer.files.length; i++) {
            files.push(event.dataTransfer.files[i]);
          }
        }
        Promise.all(
          files.map(
            file =>
              new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = function(event) {
                  resolve(event.target.result);
                };
                reader.onerror = function(error) {
                  reject(error);
                };
                reader.readAsArrayBuffer(file);
              })
          )
        )
          .then(files => onDrop(files))
          .catch(err => log(`Error while reading file: ${err}`));
      }}
    >
      Drop a PDF file here
    </div>
  );
};

export default Dropfile;