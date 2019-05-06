import React from "react";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import cn from "classnames";

import style from "./search-item.scss";

const SearchItem = ({ item, onClick }) => {
  const probilityStyle = item.probability > 50 ? style.check : item.probability > 20 ? style.probably : style.okay;
  return (
    <div className={style.root}>
      <Paper className={cn(style.paper, probilityStyle)} onClick={onClick}>
        <Typography paragraph>
          {item.url} (Probability {item.probability}%)
        </Typography>
        <Typography paragraph className={style.description}>
          <div dangerouslySetInnerHTML={{ __html: item.description }} />
        </Typography>
      </Paper>
    </div>
  );
};

export default SearchItem;
