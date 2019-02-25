import React, { useEffect, useState } from "react";
import style from "./result.scss";
import useRustCommand from "../../hooks/use-rust-command";

const Result = ({ sentences }) => {
  const fetchUrl = useRustCommand("fetchUrl");
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!result) {
      const url = `https://www.google.de/search?q=${encodeURIComponent(sentences[0])}`;
      window.updateResult = arr => setResult(arr.map(blob => atob(blob)));
      fetchUrl(url);
    }
  });

  return (
    <div className={style.root}>
      {result === null ? "Waiting for result" : <div dangerouslySetInnerHTML={{ __html: result }} />}
    </div>
  );
};

export default Result;
