import React, { useState, Fragment } from "react";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
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

  console.log("App render");

  return (
    <Fragment>
      <CssBaseline />
      <Grid container direction="column" spacing={16}>
        <Grid component="header" item xs onClick={() => setFiles(null)}>
          <Typography align="center" variant="title" noWrap>
            Welcome to Roogle.
          </Typography>
          <Typography noWrap>This is a description about roogle.</Typography>
          <Typography noWrap>
            Right now, it selects 5 random sentences from the PDF. If you click the header, Roogle will reset.
          </Typography>
        </Grid>
        <Grid item xs>
          <Divider variant="middle" />
        </Grid>
        <Grid item xs>
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
                <Tabs value={currentTab} onChange={setCurrentTab} variant="fullWidth">
                  {sentences.map((sentence, index) => (
                    <Tab key={index} label={sentence} />
                  ))}
                </Tabs>
              </AppBar>
              {sentences.map(
                (sentence, index) => currentTab === index && <Result key={sentence} sentence={sentence} />
              )}
            </Fragment>
          )}
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default App;
