import React, { ReactNode } from "react";

import classes from "./flexContainer.module.css";
import { Widget, WidgetProps } from "../Widget/widget";

interface FlexProps {
  children: ReactNode;
  flexFlow?: "rowWrap" | "column" | "row" | "columnWrap";
  style?: object;
}

export const FlexContainerComponent = (props: FlexProps): JSX.Element => {
  let classNames = [classes.FlexContainer];
  let { flexFlow = null } = props;
  if (flexFlow !== null) {
    classNames.push(classes[flexFlow]);
  }
  return (
    <div className={classNames.join(" ")} style={props.style}>
      {props.children}
    </div>
  );
};

export const FlexContainer = (props: FlexProps & WidgetProps): JSX.Element => (
  <Widget baseWidget={FlexContainerComponent} {...props} />
);
