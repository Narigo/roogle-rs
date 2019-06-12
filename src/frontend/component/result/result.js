import React from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

import useRustCommand from "../../hooks/use-rust-command";
import style from "./result.scss";
import getGoogleUrl from "../../lib/get-google-url";

const Result = ({ sentences }) => {
  const openBrowser = useRustCommand("openUrl");

  return (
    <Grid className={style.root} container>
      <Paper className={style.paper}>
        <Typography>
          These are some random sentences from the PDF. Check each one individually (opens browser) or all at once by
          clicking the button below (opens multiple browser tabs).
        </Typography>
        <Button
          className={style.openAll}
          onClick={() => {
            sentences.forEach(sentence => {
              openBrowser(getGoogleUrl(sentence));
            });
          }}
        >
          <Typography>Open all searches in Browser</Typography>
        </Button>
        <Divider className={style.divider} />
        <ul>
          {sentences.map(sentence => (
            <li key={sentence}>
              <Button
                className={style.openSentence}
                onClick={() => {
                  openBrowser(getGoogleUrl(sentence));
                }}
              >
                <Typography>{sentence}</Typography>
              </Button>
            </li>
          ))}
        </ul>
      </Paper>
    </Grid>
  );
};
Result.defaultProps = {
  sentences: []
};
Result.propTypes = {
  sentences: PropTypes.arrayOf(PropTypes.string)
};

export default Result;
