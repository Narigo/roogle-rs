import React from "react";
import Typography from "@material-ui/core/Typography";
import style from "./description.scss";

const Description = ({ text }) => {
  return (
    <div className={style.root}>
      <Typography>{text}</Typography>
    </div>
  );
};

export default Description;
