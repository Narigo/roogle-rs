import React, { useState } from "react";
import style from "./app.scss";

import { Dropfile } from "../dropfile";
import { Result } from "../result";

const App = () => {
  const [sentences, setSentences] = useState(null);
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
            console.log("event", event);
            window.external.invoke(JSON.stringify({ cmd: "log", text: "dropped something" }));
            setSentences(event);
            // const text = JSON.stringify(event);
            // window.external.invoke(JSON.stringify({ cmd: "log", text }));
          }}
        />
      ) : (
        <Result sentences={sentences} />
      )}
    </div>
  );
};

export default App;
