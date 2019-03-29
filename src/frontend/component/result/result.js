import React, { useEffect, useState } from "react";
import cheerio from "cheerio";
import Typography from "@material-ui/core/Typography";
import style from "./result.scss";
import useRustCommand from "../../hooks/use-rust-command";

const Result = ({ sentence }) => {
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
      const searchResults = $searchResults.map(elem => ({
        url: $(elem).find("cite").text(),
        description: $(elem).find(".st").text()
      }));
      setResult(searchResults);
    };
    fetchUrl(url);
  }, [sentence]);

  return (
    <div className={style.root}>
      {result === null ? (
        <Typography>`Waiting for result for: ${sentence}`</Typography>
      ) : (
        result.map((e, i) => (
          <div key={i}>
            <div>URL: {e.url}</div>
            <div>Description: {e.description}</div>
          </div>
        ))
      )}
    </div>
  );
};

export default Result;
