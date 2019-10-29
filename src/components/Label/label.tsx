import React from "react";
import propTypes from "prop-types";

import classes from "./label.module.css";
import { Widget, WidgetProps } from "../Widget/widget";
import { BaseWidgetProps } from "../Widget/widgetprops";

interface LabelComponentInterface {
  text: string | number;
  style: object;
}

export const LabelComponent = (props: LabelComponentInterface): JSX.Element => (
  // Simple component to display text - defaults to black text and dark grey background
  <div className={`Label ${classes.Label}`} style={props.style}>
    {props.text}
  </div>
);

const LabelWidgetProps = {
  text: propTypes.oneOfType([propTypes.string, propTypes.number]).isRequired,
  ...BaseWidgetProps
};

export const Label = (
  props: propTypes.InferProps<typeof LabelWidgetProps> & WidgetProps
): JSX.Element => <Widget baseWidget={LabelComponent} {...props} />;

Label.propTypes = LabelWidgetProps;
