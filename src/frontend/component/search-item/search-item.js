import React from "react";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

import style from "./search-item.scss";

const SearchItem = ({ item }) => (
  <a className={style.root} href={item.url}>
    <Paper className={style.paper}>
      <Typography paragraph>
        {item.url} (Probability {item.probability}%)
      </Typography>
      <Typography paragraph className={style.description}>
        {item.description}
      </Typography>
    </Paper>
  </a>
);

export default SearchItem;
