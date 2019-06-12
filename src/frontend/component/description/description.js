import React from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import style from "./description.scss";

const Description = ({ text }) => {
  return (
    <div className={style.root}>
      <Typography>{text}</Typography>
    </div>
  );
};
Description.defaultProps = {
  text: ""
};
Description.propTypes = {
  text: PropTypes.string
};

export default Description;
