import React, { Fragment, useState, useReducer } from "react";
import PropTypes from "prop-types";

import AppBar from "@material-ui/core/AppBar";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Result from "../result/result";

const textsReducer = (state, action) => {
  switch (action.type) {
    case "set-probability":
      const { index, maxProbability } = action.payload;
      return [...state.slice(0, index), { ...state[index], maxProbability }, ...state.slice(index + 1)];
  }
  return state;
};

const Results = ({ sentences }) => {
  const [currentTab, setCurrentTab] = useState(0);
  const [texts, dispatch] = useReducer(
    textsReducer,
    sentences.map(sentence => ({ label: sentence, maxProbability: 0 }))
  );
  return (
    <Fragment>
      <AppBar position="static">
        <Tabs value={currentTab} onChange={(_event, value) => setCurrentTab(value)} variant="fullWidth">
          {texts.map((text, index) => (
            <Tab key={index} label={`${text.label.slice(0, 25)} (${text.maxProbability})`} />
          ))}
        </Tabs>
      </AppBar>
      {sentences.map((sentence, index) => (
        <Result
          key={sentence}
          sentence={sentence}
          show={currentTab === index}
          onResult={res =>
            dispatch({
              type: "set-probability",
              payload: { index, maxProbability: res.maxProbability }
            })
          }
        />
      ))}
    </Fragment>
  );
};
Results.propTypes = {
  sencentes: PropTypes.arrayOf(PropTypes.string)
};

export default Results;
