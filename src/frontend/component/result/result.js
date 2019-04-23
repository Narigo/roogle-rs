import React, { useEffect, useState } from "react";
import cheerio from "cheerio";
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import style from "./result.scss";
import useRustCommand from "../../hooks/use-rust-command";
import cn from "classnames";
import { SearchItem } from "../search-item";
import { Description } from "../description";

const Result = ({ onResult, sentence, show }) => {
  const fetchUrl = useRustCommand("fetchUrl");
  const log = useRustCommand("log");
  const [result, setResult] = useState(null);
  const [failure, setFailure] = useState(null);

  useEffect(() => {
    const url = `https://www.google.de/search?q=${encodeURIComponent(sentence)}`;
    window.updateResult = window.updateResult || {};
    window.updateResult[url] = blob => {
      const data = atob(blob);
      log(data);
      if (data === "failed") {
        setFailure(data);
        return;
      }
      const $ = cheerio.load(data);
      const $searchResults = $("#search ol .g");
      const searchResults = $searchResults
        .map((_index, elem) => {
          const $elem = $(elem);
          const $description = $elem.find(".st");
          const boldTextLength = $description.find("b").text().length;
          const textLength = $description.text().length;
          return {
            url: $elem.find("cite").text(),
            description: $description.html(),
            probability: Math.round((100 * boldTextLength) / textLength) || 0
          };
        })
        .get();
      const res = {
        maxProbability: searchResults.reduce((maxProb, e) => (e.probability > maxProb ? e.probability : maxProb), 0),
        searchResults: searchResults.sort((a, b) => b.probability - a.probability)
      };
      setResult(res);
      if (onResult) {
        onResult(res);
      }
    };
    fetchUrl(url);
  }, [sentence]);

  return (
    <div className={cn(style.root, show && style.show)}>
      {result === null && failure === null && <LinearProgress variant="indeterminate" />}
      {failure !== null ? (
        <Typography>Failed to fetch result for: {sentence}</Typography>
      ) : result === null ? (
        <Typography>Waiting for result for: {sentence}</Typography>
      ) : (
        <Grid container>
          <Paper className={style.probability}>
            <Typography variant="headline">Probability of plagiarism: {result.maxProbability} %</Typography>
            <Description text={sentence} />
          </Paper>
          {result.searchResults.map((e, i) => (
            <SearchItem item={e} key={i} />
          ))}
        </Grid>
      )}
    </div>
  );
};

export default Result;
