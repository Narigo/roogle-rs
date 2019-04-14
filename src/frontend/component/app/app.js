import React, { useState, Fragment } from "react";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Typography from "@material-ui/core/Typography";
import "typeface-roboto";

import style from "./app.scss";

import { Dropfile } from "../dropfile";
import { Process } from "../process";
import { Result } from "../result";
import useRustCommand from "../../hooks/use-rust-command";

const App = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [files, setFiles] = useState(null);
  const [sentences, setSentences] = useState(null);
  const log = useRustCommand("log");

  return (
    <Fragment>
      <CssBaseline />
      <Grid container direction="column" className={style.root} wrap="nowrap">
        <Paper className={style.header}>
          <Typography align="center" variant="title">
            Welcome to Roogle
          </Typography>
        </Paper>
        <Grid item xs className={style.dropzone}>
          {files === null ? (
            <Dropfile
              onDrop={files => {
                log(`dropped something`);
                setFiles(files);
              }}
            />
          ) : sentences === null ? (
            <Process files={files} onDone={sentences => setSentences(sentences)} />
          ) : (
            <Fragment>
              <AppBar position="static">
                <Tabs value={currentTab} onChange={(_event, value) => setCurrentTab(value)} variant="fullWidth">
                  {sentences.map((sentence, index) => {
                    return <Tab key={index} label={`${sentence.slice(0, 25)}...`} />;
                  })}
                </Tabs>
              </AppBar>
              {sentences.map((sentence, index) => (
                <Result key={sentence} sentence={sentence} show={currentTab === index} />
              ))}
            </Fragment>
          )}
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default App;
