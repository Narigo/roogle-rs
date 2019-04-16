import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";

import AppBar from "@material-ui/core/AppBar";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Result from "../result/result";

const Results = ({ sentences }) => {
  const [currentTab, setCurrentTab] = useState(0);
  return (
    <Fragment>
      <AppBar position="static">
        <Tabs value={currentTab} onChange={(_event, value) => setCurrentTab(value)} variant="fullWidth">
          {sentences.map((sentence, index) => {
            return <Tab key={index} label={`${sentence.slice(0, 25)}...`} />;
          })}
        </Tabs>
      </AppBar>
      {sentences.map((sentence, index) => (
        <Result key={sentence} sentence={sentence} show={currentTab === index} />
      ))}
    </Fragment>
  );
};
Results.propTypes = {
  sencentes: PropTypes.arrayOf(PropTypes.string)
};

export default Results;
