import React, { CSSProperties } from "react";

import classes from "./label.module.css";
import { Widget, commonCss } from "../widget";
import { WidgetPropType } from "../widgetProps";
import { registerWidget } from "../register";
import {
  BoolPropOpt,
  InferWidgetProps,
  StringPropOpt,
  ChoicePropOpt,
  FontPropOpt,
  ColorPropOpt,
  BorderPropOpt,
  FloatPropOpt
} from "../propTypes";

const LabelProps = {
  text: StringPropOpt,
  visible: BoolPropOpt,
  transparent: BoolPropOpt,
  className: StringPropOpt,
  textAlign: ChoicePropOpt(["left", "center", "right"]),
  font: FontPropOpt,
  foregroundColor: ColorPropOpt,
  backgroundColor: ColorPropOpt,
  border: BorderPropOpt,
  rotationAngle: FloatPropOpt
};

const LabelWidgetProps = {
  ...LabelProps,
  ...WidgetPropType
};

export const LabelComponent = (
  props: InferWidgetProps<typeof LabelProps>
): JSX.Element => {
  // Default labels to transparent.
  const editedProps = {
    ...props,
    transparent: props.transparent ?? true
  };
  const style: CSSProperties = commonCss(editedProps);
  const { textAlign = "center", text = "", rotationAngle } = props;
  const className = props.className ?? `Label ${classes.Label}`;
  // Since display is "flex", use "flex-start" and "flex-end" to align
  // the content.
  let alignment = "center";
  if (textAlign === "left") {
    alignment = "flex-start";
  } else if (textAlign === "right") {
    alignment = "flex-end";
  }
  style["justifyContent"] = alignment;
  style["cursor"] = "default";
  let transform = undefined;
  if (rotationAngle) {
    transform = `rotate(${rotationAngle}deg)`;
  }

  // Simple component to display text - defaults to black text and dark grey background
  return (
    <div className={className} style={style}>
      <span style={{ transform }}> {text} </span>
    </div>
  );
};

export const Label = (
  props: InferWidgetProps<typeof LabelWidgetProps>
): JSX.Element => <Widget baseWidget={LabelComponent} {...props} />;

registerWidget(Label, LabelWidgetProps, "label");
