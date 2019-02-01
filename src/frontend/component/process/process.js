import React, { useState } from "react";
import style from "./process.scss";

const Process = ({ files }) => {
  const [sentences, setSentences] = useState(null);
  return <div className={style.root}>{!sentences ? <div>Processing files {files}</div> : <div>{sentences}</div>}</div>;
};

export default Process;
