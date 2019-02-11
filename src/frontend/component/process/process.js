import React, { useEffect, useState } from "react";
import parsePdf from "parse-pdf";
import style from "./process.scss";
import useRustCommand from "../../hooks/use-rust-command.js";

const Process = ({ files }) => {
  const [sentences, setSentences] = useState(null);
  const [progress, setProgress] = useState("start");
  const log = useRustCommand("log");
  const logLong = useRustCommand("logLong");
  const createFile = useRustCommand("createTmpFile");
  const readPdf = useRustCommand("readPdf");
  const splitText = useRustCommand("splitText");
  const removeFile = useRustCommand("removeTmpFile");

  useEffect(() => {
    let cancelled = false;
    let tmpFile;

    console.log("parsing files", files);
    parsePdf(files[0])
      .then(
        checkCancelled(data => {
          console.log("parsed data!", data);
          const text = data.pages.reduce((text, page) => `${text}\n${page.text}`, "");
          setProgress("process-text");
          return splitTextIntoSentences({ text, log });
        })
      )
      .then(
        checkCancelled(sentences => {
          setProgress("done");
          return setSentences(sentences);
        })
      )
      .catch(error => {
        console.log("catched!", error);
        if (error.message !== "cancelled") {
          throw error;
        }
      });
    return () => {
      cancelled = true;
    };

    function checkCancelled(fn) {
      return (...args) => {
        if (!cancelled) {
          return fn(...args);
        } else {
          throw new Error("cancelled");
        }
      };
    }
  }, [files]);
  return (
    <div className={style.root}>
      {progress === "start" ? (
        <div>Creating temp file from binary in Rust</div>
      ) : progress === "process-text" ? (
        <div>Selecting sentences</div>
      ) : (
        <div>{sentences}</div>
      )}
    </div>
  );
};

export default Process;

function splitTextIntoSentences({ text, log }) {
  console.log(`called splitTextIntoSentences(${text})`);
  log("splitting text");
  return text.split(/([.!;:]+\s+)/g);
}
