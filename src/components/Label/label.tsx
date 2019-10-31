import React from "react";
import PropTypes from "prop-types";

import classes from "./label.module.css";
import { Component, Widget, WidgetPropType } from "../Widget/widget";

const LabelProps = {
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
};

export const LabelComponent = (
  props: PropTypes.InferProps<typeof LabelProps> & Component
): JSX.Element => (
  // Simple component to display text - defaults to black text and dark grey background
  <div className={`Label ${classes.Label}`} style={props.style}>
    {props.text}
  </div>
);

const LabelWidgetProps = {
  ...LabelProps,
  ...WidgetPropType
};

export const Label = (
  props: PropTypes.InferProps<typeof LabelWidgetProps>
): JSX.Element => <Widget baseWidget={LabelComponent} {...props} />;

Label.propTypes = LabelWidgetProps;
