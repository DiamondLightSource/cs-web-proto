import React from "react";

import classes from "./Label.module.css";

export const Label = (props: { text: string | number; style?: object }) => (
  // Simple component to display text - defaults to black text and dark grey background
  <div className={classes.Label} style={props.style}>
    {props.text}
  </div>
);
