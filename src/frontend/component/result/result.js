import React from "react";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

import useRustCommand from "../../hooks/use-rust-command";
import style from "./result.scss";
import getGoogleUrl from "../../lib/get-google-url";

const Result = ({ sentences }) => {
  const openBrowser = useRustCommand("openUrl");

  return (
    <Paper className={style.root}>
      <Typography>The browser should open a few tabs now. If it did not, these are your URLs to open:</Typography>
      <ul>
        {sentences.map(sentence => (
          <li key={sentence}>
            <a href={getGoogleUrl(sentence)}>
              <Typography>{sentence}</Typography>
            </a>
          </li>
        ))}
      </ul>
      <Button
        onClick={() => {
          sentences.forEach(sentence => {
            openBrowser(getGoogleUrl(sentence));
          });
        }}
      >
        <Typography>Open all searches in Browser</Typography>
      </Button>
    </Paper>
  );
};

export default Result;
