import React from "react";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

import style from "./search-item.scss";

const SearchItem = ({ item, onClick }) => (
  <div className={style.root}>
    <Paper className={style.paper} onClick={onClick}>
      <Typography paragraph>
        {item.url} (Probability {item.probability}%)
      </Typography>
      <Typography paragraph className={style.description}>
        <div dangerouslySetInnerHTML={{ __html: item.description }} />
      </Typography>
    </Paper>
  </div>
);

export default SearchItem;
