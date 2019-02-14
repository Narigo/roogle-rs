import React, { useState } from "react";
import style from "./app.scss";

import { Dropfile } from "../dropfile";
import { Process } from "../process";
import { Result } from "../result";
import useRustCommand from "../../hooks/use-rust-command";

const App = () => {
  const [files, setFiles] = useState(null);
  const [sentences, setSentences] = useState(null);
  const log = useRustCommand("log");

  console.log("App render");

  return (
    <div className={style.root}>
      <header className={style.header} onClick={() => setFiles(null)}>
        <h1>Welcome to Roogle.</h1>
        <p>This is a description about roogle.</p>
        <p>Right now, it selects 5 random sentences from the PDF. If you click the header, Roogle will reset.</p>
      </header>
      {files === null ? (
        <Dropfile
          onDrop={files => {
            log(`dropped something`);
            setFiles(files);
          }}
        />
      ) : sentences === null ? (
        <Process files={files} onDone={sentences => setSentences(sentences)} />
      ) : (
        <Result sentences={sentences} />
      )}
    </div>
  );
};

export default App;
