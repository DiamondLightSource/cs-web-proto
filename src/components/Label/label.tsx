import React from "react";
import PropTypes from "prop-types";

import classes from "./label.module.css";
import {
  Component,
  Widget,
  WidgetPropType,
  InferWidgetProps
} from "../Widget/widget";

const LabelProps = {
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  visible: PropTypes.bool,
  indent: PropTypes.string
};

export const LabelComponent = (
  props: PropTypes.InferProps<typeof LabelProps> & Component
): JSX.Element => {
  const style: any = { ...props.style };
  if (props.visible !== undefined && !props.visible) {
    style["visibility"] = "hidden";
  }
  if (props.indent !== undefined) {
    style["text-indent"] = props.indent;
  }
  // Simple component to display text - defaults to black text and dark grey background
  return (
    <div className={`Label ${classes.Label}`} style={style}>
      {props.text}
    </div>
  );
};

const LabelWidgetProps = {
  ...LabelProps,
  ...WidgetPropType
};

export const Label = (
  props: InferWidgetProps<typeof LabelWidgetProps>
): JSX.Element => <Widget baseWidget={LabelComponent} {...props} />;

Label.propTypes = LabelWidgetProps;
