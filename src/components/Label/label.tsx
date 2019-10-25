import React from "react";

import classes from "./label.module.css";
import { Widget, WidgetInterface } from "../Widget/widget";

export const LabelComponent = (props: {
  text: string | number;
  style?: object;
}): JSX.Element => (
  // Simple component to display text - defaults to black text and dark grey background
  <div className={`Label ${classes.Label}`} style={props.style}>
    {props.text}
  </div>
);

interface LabelWidgetProps {
  text: string | number;
}

export const Label = (
  props: LabelWidgetProps & WidgetInterface
): JSX.Element => <Widget baseWidget={LabelComponent} {...props} />;

export const Lab = (props: LabelWidgetProps): JSX.Element => {
  return (
    <Label text="hello" containerStyling={{ position: "relative" }}></Label>
  );
};
