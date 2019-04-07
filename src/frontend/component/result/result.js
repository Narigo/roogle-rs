import React, { useEffect, useState } from "react";
import cheerio from "cheerio";
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import style from "./result.scss";
import useRustCommand from "../../hooks/use-rust-command";
import cn from "classnames";

const Result = ({ sentence, show }) => {
  const fetchUrl = useRustCommand("fetchUrl");
  const log = useRustCommand("log");
  const [result, setResult] = useState(null);

  useEffect(() => {
    const url = `https://www.google.de/search?q=${encodeURIComponent(sentence)}`;
    window.updateResult = window.updateResult || {};
    window.updateResult[url] = blob => {
      const data = atob(blob);
      log(data);
      const $ = cheerio.load(data);
      const $searchResults = $("#search ol .g");
      const searchResults = $searchResults
        .map((_index, elem) => {
          const $elem = $(elem);
          const $description = $elem.find(".st");
          return {
            url: $elem.find("cite").text(),
            description: $description.html(),
            probability: Math.round((100 * $description.find("b").text().length) / $description.text().length)
          };
        })
        .get();
      setResult({
        maxProbability: searchResults.reduce((maxProb, e) => (e.probability > maxProb ? maxProb : e.probability), 0),
        searchResults: searchResults.sort((a, b) => a.probability - b.probability)
      });
    };
    fetchUrl(url);
  }, [sentence]);

  return (
    <div className={cn(style.root, show && style.show)}>
      <LinearProgress variant="determinate" value={result === null ? 50 : 100} />
      {result === null ? (
        <Typography>Waiting for result for: {sentence}</Typography>
      ) : (
        <Grid container spacing={20}>
          <Paper className={style.item}>
            <Typography variant="h3">Probability of plagiarism: {result.maxProbability} %</Typography>
            <Typography paragraph>{sentence}</Typography>
          </Paper>
          {result.searchResults.map((e, i) => (
            <Paper className={style.item} key={i}>
              <a href={e.url}>
                <Typography paragraph>{e.url}</Typography>
                <Typography paragraph>{e.description}</Typography>
              </a>
            </Paper>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default Result;
