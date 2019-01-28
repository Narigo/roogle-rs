import React from "react";
import style from "./app.scss";

const App = () => {
  console.log("style", style);
  return (
    <div className={style.root}>
      <header className={style.header}>
        <h1>Welcome to Roogle.</h1>
        <p>This is a description about roogle.</p>
      </header>
      <div
        className={style.dropfile}
        onClick={() => {
          window.external.invoke(JSON.stringify({ cmd: "log", text: "hello click!" }));
        }}
      >
        Drop a PDF file here
      </div>
    </div>
  );
};

export default App;
