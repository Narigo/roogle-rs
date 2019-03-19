import React, { useEffect, useState } from "react";
import cheerio from "cheerio";
import Typography from "@material-ui/core/Typography";
import style from "./result.scss";
import useRustCommand from "../../hooks/use-rust-command";

const Result = ({ sentence }) => {
  const fetchUrl = useRustCommand("fetchUrl");
  const [result, setResult] = useState(null);

  useEffect(() => {
    const url = `https://www.google.de/search?q=${encodeURIComponent(sentence)}`;
    window.updateResult = window.updateResult || {};
    window.updateResult[url] = blob => {
      const data = atob(blob);
      console.log("updateResult", { data });
      const $ = cheerio.load(data);
      setResult($("#search ol").find("div"));
    };
    fetchUrl(url);
  }, [sentence]);

  return (
    <div className={style.root}>
      <Typography>
        {result === null ? `Waiting for result for: ${sentence}` : <div dangerouslySetInnerHTML={{ __html: result }} />}
      </Typography>
    </div>
  );
};

export default Result;
