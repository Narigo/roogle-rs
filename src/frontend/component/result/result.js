import React from "react";
import style from "./result.scss";

const Result = ({ sentences }) => {
  return <div className={style.root}>{sentences}</div>;
};

export default Result;
