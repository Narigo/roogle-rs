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
          onDrop={event => {
            log(`dropped something ${JSON.stringify(event.dataTransfer.getData())}`);
            setSentences(JSON.stringify(event.dataTransfer));
          }}
        />
      ) : (
        <Result sentences={sentences} />
      )}
    </div>
  );
};

export default App;
