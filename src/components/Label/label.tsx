import React from "react";

import classes from "./label.module.css";
import { Component, Widget, WidgetPropType } from "../Widget/widget";
import { registerWidget } from "../register";
import { BoolPropOpt, StringOrNumProp, InferWidgetProps } from "../propTypes";

const LabelProps = {
  text: StringOrNumProp,
  visible: BoolPropOpt,
  transparent: BoolPropOpt
};

export const LabelComponent = (
  props: InferWidgetProps<typeof LabelProps> & Component
): JSX.Element => {
  const style: any = { ...props.style };
  if (props.visible !== undefined && !props.visible) {
    style["visibility"] = "hidden";
  }
  if (props.transparent !== undefined && props.transparent) {
    style["backgroundColor"] = "transparent";
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

registerWidget(Label, LabelWidgetProps, "label");
