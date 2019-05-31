import React, { useState } from "react";
import cn from "classnames";
import style from "./dropfile.scss";
import useRustCommand from "../../hooks/use-rust-command";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

const Dropfile = ({ onDrop }) => {
  const [dragOver, setDragOver] = useState(false);
  const log = useRustCommand("log");
  const onDropHandler = event => {
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
  };

  return (
    <Grid
      className={cn(style.root, dragOver && style.dragOver)}
      container
      alignItems="center"
      justify="center"
      onDragOver={event => {
        event.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={event => {
        event.preventDefault();
        setDragOver(false);
      }}
      onDrop={onDropHandler}
    >
      <Paper className={style.description}>
        <Typography variant="h3">Dropzone!</Typography>
        <Typography>Drag and drop a PDF file here, to check it for plagiarism.</Typography>
      </Paper>
    </Grid>
  );
};

export default Dropfile;
