import React from "react";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

import style from "./search-item.scss";

const SearchItem = ({ item }) => (
  <Paper className={style.root}>
    <a href={item.url}>
      <Typography paragraph>
        {item.url} (Probability {item.probability}%)
      </Typography>
      <Typography paragraph className={style.description}>
        {item.description}
      </Typography>
    </a>
  </Paper>
);

export default SearchItem;
