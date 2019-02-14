import React, { useEffect } from "react";
import style from "./result.scss";
import useRustCommand from "../../hooks/use-rust-command";

const Result = ({ sentences }) => {
  const openUrl = useRustCommand("openUrl");
  useEffect(() => {
    openUrl(`https://www.google.de/search?q=${encodeURIComponent(sentences[0])}`);
  });
  return <div className={style.root}>This is the result: {sentences}</div>;
};

export default Result;
