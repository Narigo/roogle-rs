import React, { useState } from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import useRustCommand from "../../hooks/use-rust-command";
import style from "./dropfile.scss";

const Dropfile = ({ onDrop }) => {
  const [dragOver, setDragOver] = useState(false);
  const log = useRustCommand("log");
  const onDropHandler = event => {
    event.preventDefault();
    const files = [];
    if (event.dataTransfer.items) {
      for (let i = 0; i < event.dataTransfer.items.length; i += 1) {
        if (event.dataTransfer.items[i].kind === "file") {
          files.push(event.dataTransfer.items[i].getAsFile());
        }
      }
    } else {
      for (let i = 0; i < event.dataTransfer.files.length; i += 1) {
        files.push(event.dataTransfer.files[i]);
      }
    }
    Promise.all(
      files.map(
        file =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = loadEvent => {
              resolve(loadEvent.target.result);
            };
            reader.onerror = error => {
              reject(error);
            };
            reader.readAsArrayBuffer(file);
          })
      )
    )
      .then(droppedFiles => onDrop(droppedFiles))
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
        <Typography variant="h5">Dropzone!</Typography>
        <Typography>Drag and drop a PDF file here, to check it for plagiarism.</Typography>
      </Paper>
    </Grid>
  );
};
Dropfile.propTypes = {
  onDrop: PropTypes.func.isRequired
};

export default Dropfile;
