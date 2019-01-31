import React, { useState } from "react";
import style from "./app.scss";

import { Dropfile } from "../dropfile";
import { Result } from "../result";
import useRustCommand from "../../hooks/use-rust-command";

const App = () => {
  const [sentences, setSentences] = useState(null);
  const log = useRustCommand("log");
  console.log("App render");

  return (
    <div className={style.root}>
      <header className={style.header}>
        <h1>Welcome to Roogle.</h1>
        <p>This is a description about roogle.</p>
      </header>
      {sentences === null ? (
        <Dropfile
          onDrop={files => {
            log(`dropped something ${JSON.stringify(files.map(f => Object.keys(f)))}`);
            setSentences(files);
          }}
        />
      ) : (
        <Result sentences={sentences} />
      )}
    </div>
  );
};

export default App;
