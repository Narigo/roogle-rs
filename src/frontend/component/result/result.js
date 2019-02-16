import React, { useEffect, useState } from "react";
import style from "./result.scss";
// import useRustCommand from "../../hooks/use-rust-command";

const Result = ({ sentences }) => {
  // const openUrl = useRustCommand("openUrl");
  const [result, setResult] = useState(null);
  useEffect(() => {
    const url = `https://www.google.de/search?q=${encodeURIComponent(sentences[0])}`;
    fetch(url, { mode: "no-cors" })
      .then(res => res.body())
      .then(setResult);
  });
  return <div className={style.root}>{result === null ? "Waiting for result" : result}</div>;
};

export default Result;
