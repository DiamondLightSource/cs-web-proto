import React, { ReactNode } from "react";

import classes from "./flexContainer.module.css";

export const FlexContainer = (props: { children: ReactNode }): JSX.Element => {
  return <div className={classes.FlexContainer}>{props.children}</div>;
};
