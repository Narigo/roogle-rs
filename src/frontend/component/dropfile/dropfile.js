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
      onDrop={event => {
        event.preventDefault();
        setDragOver(false);
        onDrop(event);
      }}
    >
      Drop a PDF file here
    </div>
  );
};

export default Dropfile;
