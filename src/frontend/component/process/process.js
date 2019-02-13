import React, { useEffect, useState } from "react";
import parsePdf from "parse-pdf";
import style from "./process.scss";
import useRustCommand from "../../hooks/use-rust-command.js";

const Process = ({ files, onDone }) => {
  const [progress, setProgress] = useState("start");
  const log = useRustCommand("log");

  useEffect(() => {
    let cancelled = false;

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
          setProgress("selecting-sentences");
          return selectSentences({ sentences });
        })
      )
      .then(
        checkCancelled(sentences => {
          setProgress("done");
          onDone(sentences);
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
        <div>Processing text</div>
      ) : progress === "selecting-sentences" ? (
        <div>Selecting sentences</div>
      ) : (
        <div>Done processing!</div>
      )}
    </div>
  );
};

export default Process;

function splitTextIntoSentences({ text, log }) {
  console.log(`called splitTextIntoSentences(${text})`);
  log("splitting text");
  return text.split(/[:.!?\n]+/g);
}

function selectSentences({ amountOfSentences = 5, minimumLengthOfSentence = 50, sentences }) {
  const selected = [];
  const possibleSentences = sentences.filter(minLength(minimumLengthOfSentence));
  const chunkSize = possibleSentences.length / amountOfSentences;
  for (let i = 0; i < amountOfSentences; i++) {
    selected.push(possibleSentences[i * chunkSize + Math.floor(Math.random() * chunkSize)]);
  }
  return selected;
}

function minLength(minimumLengthOfSentence) {
  return sentence => {
    return sentence.length > minimumLengthOfSentence;
  };
}
