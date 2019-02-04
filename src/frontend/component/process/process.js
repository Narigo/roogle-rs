import React, { useEffect, useState } from "react";
import style from "./process.scss";

const Process = ({ files }) => {
  const [sentences, setSentences] = useState(null);
  const [progress, setProgress] = useState("start");

  useEffect(() => {
    let cancelled = false;
    let tmpFile;
    writeTmpFile()
      .then(file => {
        if (!cancelled) {
          setProgress("tmp-file-created");
          tmpFile = file;
          return readPdfIntoText(file);
        } else {
          throw new Error("cancelled");
        }
      })
      .then(text => {
        if (!cancelled) {
          setProgress("process-text");
          return splitTextIntoSentences(text);
        } else {
          throw new Error("cancelled");
        }
      })
      .then(sentences => {
        if (!cancelled) {
          setProgress("remove-tmp-file");
          return removeTmpFile(tmpFile).then(() => sentences);
        } else {
          throw new Error("cancelled");
        }
      })
      .then(sentences => {
        if (!cancelled) {
          setProgress("done");
          return setSentences(sentences);
        } else {
          throw new Error("cancelled");
        }
      })
      .catch(error => {
        console.log("catched!");
        if (error.message === "cancelled") {
          if (tmpFile) {
            return removeTmpFile(tmpFile);
          }
        }
      });
    return () => {
      cancelled = true;
    };
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
