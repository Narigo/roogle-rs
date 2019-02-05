import React, { useEffect, useState } from "react";
import style from "./process.scss";

const Process = ({ files }) => {
  const [sentences, setSentences] = useState(null);
  const [progress, setProgress] = useState("start");

  useEffect(() => {
    let cancelled = false;
    let tmpFile;
    writeTmpFile()
      .then(
        checkCancelled(file => {
          setProgress("tmp-file-created");
          tmpFile = file;
          return readPdfIntoText(file);
        })
      )
      .then(
        checkCancelled(text => {
          setProgress("process-text");
          return splitTextIntoSentences(text);
        })
      )
      .then(
        checkCancelled(sentences => {
          setProgress("remove-tmp-file");
          return removeTmpFile(tmpFile).then(() => sentences);
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
            return removeTmpFile(tmpFile);
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

function writeTmpFile() {
  console.log(`called writeTmpFile()`);
  return new Promise(resolve => {
    setTimeout(() => resolve("/tmp/someFile"), 2000);
  });
}
function readPdfIntoText(file) {
  console.log(`called readPdfIntoText(${file})`);
  return new Promise(resolve => {
    setTimeout(() => resolve("This is a test. Hello, good morning! Another test sentence."), 2000);
  });
}
function splitTextIntoSentences(text) {
  console.log(`called splitTextIntoSentences(${text})`);
  return new Promise(resolve => {
    setTimeout(() => resolve(["This is a test", "Hello good morning", "Another test sentence"]), 2000);
  });
}
function removeTmpFile(tmpFile) {
  console.log(`called removeTmpFile(${tmpFile})`);
  return new Promise(resolve => {
    setTimeout(resolve, 2000);
  });
}
