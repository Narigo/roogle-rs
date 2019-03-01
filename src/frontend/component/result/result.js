import React, { useEffect, useState } from "react";
import style from "./result.scss";
import useRustCommand from "../../hooks/use-rust-command";

const Result = ({ sentence }) => {
  const fetchUrl = useRustCommand("fetchUrl");
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!result) {
      const url = `https://www.google.de/search?q=${encodeURIComponent(sentence)}`;
      window.updateResult = window.updateResult || {};
      window.updateResult[url] = arr => setResult(arr.map(blob => atob(blob)));
      fetchUrl(url);
    }
  });

  return (
    <div className={style.root}>
      {result === null ? `Waiting for result for: ${sentence}` : <div dangerouslySetInnerHTML={{ __html: result }} />}
    </div>
  );
};

export default Result;
