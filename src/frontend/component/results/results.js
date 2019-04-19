import React, { Fragment, useState, useReducer } from "react";
import PropTypes from "prop-types";

import AppBar from "@material-ui/core/AppBar";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Result from "../result/result";

const textsReducer = (state, action) => {
  const newState = state;
  newState[action.index].maxProbability = action.probability;
  return newState;
};

const Results = ({ sentences }) => {
  const [currentTab, setCurrentTab] = useState(0);
  const [texts, dispatch] = useReducer(
    textsReducer,
    sentences.map(sentence => ({ label: `${sentence.slice(0, 25)}...`, maxProbability: 0 }))
  );
  return (
    <Fragment>
      <AppBar position="static">
        <Tabs value={currentTab} onChange={(_event, value) => setCurrentTab(value)} variant="fullWidth">
          {texts.map((text, index) => (
            <Tab key={index} label={text.label} />
          ))}
        </Tabs>
      </AppBar>
      {sentences.map((sentence, index) => (
        <Result
          key={sentence}
          sentence={sentence}
          show={currentTab === index}
          onResult={res => {
            console.log("got a result");
            dispatch({ index, probability: res.maxProbability });
          }}
        />
      ))}
    </Fragment>
  );
};
Results.propTypes = {
  sencentes: PropTypes.arrayOf(PropTypes.string)
};

export default Results;
