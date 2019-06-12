import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import LinearProgress from "@material-ui/core/LinearProgress";
import Typography from "@material-ui/core/Typography";
import parsePdf from "parse-pdf";
import style from "./process.scss";
import useRustCommand from "../../hooks/use-rust-command";

const Process = ({ files, onDone }) => {
  const [progress, setProgress] = useState("start");
  const log = useRustCommand("log");

  useEffect(() => {
    let cancelled = false;

    parsePdf(files[0])
      .then(
        checkCancelled(data => {
          const text = data.pages.reduce((acc, page) => `${acc}\n${page.text}`, "");
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
        }
        throw new Error("cancelled");
      };
    }
  }, [files]);

  const completion =
    progress === "start" ? 0 : progress === "process-text" ? 20 : progress === "selecting-sentences" ? 40 : 50;

  return (
    <div className={style.root}>
      <LinearProgress variant="determinate" value={completion} />
      <Typography>
        {progress === "start"
          ? "Creating temp file from binary in Rust"
          : progress === "process-text"
          ? "Processing text"
          : progress === "selecting-sentences"
          ? "Selecting sentences"
          : "Done processing!"}
      </Typography>
    </div>
  );
};
Process.propTypes = {
  files: PropTypes.arrayOf(PropTypes.any).isRequired,
  onDone: PropTypes.func.isRequired
};

export default Process;

function splitTextIntoSentences({ text, log }) {
  log("splitting text");
  return text.split(/[:.!?\n]+/g);
}

function selectSentences({ amountOfSentences = 5, minimumLengthOfSentence = 50, sentences }) {
  const selected = [];
  const possibleSentences = sentences.filter(minLength(minimumLengthOfSentence));
  const chunkSize = Math.max(1, possibleSentences.length / amountOfSentences);
  for (let i = 0; i < amountOfSentences && i < possibleSentences.length; i += 1) {
    const elementInPossibleSentences = Math.floor(i * chunkSize + Math.random() * chunkSize);
    selected.push(possibleSentences[elementInPossibleSentences]);
  }
  return selected.filter(sentence => !!sentence);
}

function minLength(minimumLengthOfSentence) {
  return sentence => {
    return sentence.length > minimumLengthOfSentence;
  };
}
