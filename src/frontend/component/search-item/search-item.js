import React from "react";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import cn from "classnames";

import style from "./search-item.scss";

const WARNING_PERCENTAGE = 40;
const MAYBE_PERCENTAGE = 20;

const SearchItem = ({ item, onClick }) => {
  const probilityStyle =
    item.probability > WARNING_PERCENTAGE
      ? style.check
      : item.probability > MAYBE_PERCENTAGE
      ? style.probably
      : style.okay;
  return (
    <div className={style.root}>
      <Paper className={cn(style.paper, probilityStyle)} onClick={onClick}>
        <Typography paragraph>
          {item.url} (Probability {item.probability}%)
        </Typography>
        <Typography paragraph className={style.description} dangerouslySetInnerHTML={{ __html: item.description }} />
      </Paper>
    </div>
  );
};

export default SearchItem;
