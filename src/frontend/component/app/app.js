import React, { useState } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import "typeface-roboto";

import style from "./app.scss";

import Dropfile from "../dropfile";
import Process from "../process";
import Result from "../result";

const App = () => {
  const [files, setFiles] = useState(null);
  const [sentences, setSentences] = useState(null);

  return (
    <>
      <CssBaseline />
      <Grid container direction="column" className={style.root} wrap="nowrap">
        <Paper className={style.header} elevation={0}>
          <Typography align="center" variant="h6">
            Welcome to Roogle
            {files !== null && (
              <Button
                onClick={() => {
                  setFiles(null);
                  setSentences(null);
                }}
              >
                <Typography>Reset</Typography>
              </Button>
            )}
          </Typography>
        </Paper>
        <Grid item xs className={style.dropzone}>
          {files === null ? (
            <Dropfile
              onDrop={droppedFiles => {
                setFiles(droppedFiles);
              }}
            />
          ) : sentences === null ? (
            <Process files={files} onDone={sentencesResult => setSentences(sentencesResult)} />
          ) : (
            <Result sentences={sentences} />
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default App;
