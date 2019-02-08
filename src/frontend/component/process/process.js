import React, { useEffect, useState } from "react";
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
    createTmpFile({ log: logLong })
      .then(
        checkCancelled(file => {
          setProgress("tmp-file-created");
          tmpFile = file;
          return readPdfIntoText({ file, log });
        })
      )
      .then(
        checkCancelled(text => {
          setProgress("process-text");
          return splitTextIntoSentences({ text, log });
        })
      )
      .then(
        checkCancelled(sentences => {
          setProgress("remove-tmp-file");
          return removeTmpFile({ file: tmpFile, log }).then(() => sentences);
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
        if (error.message === "cancelled") {
          if (tmpFile) {
            return removeTmpFile({ file: tmpFile, log });
          }
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
      ) : progress === "tmp-file-created" ? (
        <div>temp file created, reading PDF</div>
      ) : progress === "process-text" ? (
        <div>Selecting sentences</div>
      ) : progress === "remove-tmp-file" ? (
        <div>Cleaning up and continue to show results</div>
      ) : (
        <div>{sentences}</div>
      )}
    </div>
  );
};

export default Process;

function createTmpFile({ log }) {
  console.log(`called writeTmpFile()`);
  return new Promise(resolve => {
    log("is this actually sync?");
    setTimeout(() => resolve("/tmp/someFile"), 2000);
  });
}
function readPdfIntoText({ file, log }) {
  console.log(`called readPdfIntoText(${file})`);
  return new Promise(resolve => {
    log("reading pdf");
    setTimeout(() => resolve("This is a test. Hello, good morning! Another test sentence."), 2000);
  });
}
function splitTextIntoSentences({ text, log }) {
  console.log(`called splitTextIntoSentences(${text})`);
  return new Promise(resolve => {
    log("splitting text");
    setTimeout(() => resolve(["This is a test", "Hello good morning", "Another test sentence"]), 2000);
  });
}
function removeTmpFile({ file, log }) {
  console.log(`called removeTmpFile(${file})`);
  return new Promise(resolve => {
    log("removing tempfile");
    setTimeout(resolve, 2000);
  });
}
