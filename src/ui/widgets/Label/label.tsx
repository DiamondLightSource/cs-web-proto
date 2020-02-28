import React from "react";

import classes from "./label.module.css";
import { Widget } from "../widget";
import { WidgetPropType } from "../widgetProps";
import { registerWidget } from "../register";
import {
  BoolPropOpt,
  StringProp,
  InferWidgetProps,
  StringPropOpt,
  ChoicePropOpt,
  FontPropOpt,
  ColorPropOpt,
  BorderPropOpt
} from "../propTypes";

const LabelProps = {
  text: StringProp,
  visible: BoolPropOpt,
  transparent: BoolPropOpt,
  className: StringPropOpt,
  textAlign: ChoicePropOpt(["left", "center", "right"]),
  font: FontPropOpt,
  foregroundColor: ColorPropOpt,
  backgroundColor: ColorPropOpt,
  border: BorderPropOpt
};

const LabelWidgetProps = {
  ...LabelProps,
  ...WidgetPropType
};

type LabelWidget = InferWidgetProps<typeof LabelWidgetProps>;

export const LabelComponent = (
  props: InferWidgetProps<typeof LabelProps>
): JSX.Element => {
  const { visible = true, transparent = false, textAlign = "center" } = props;
  const className = props.className ?? `Label ${classes.Label}`;
  const style: any = { ...props.font?.asStyle(), ...props.border?.asStyle() };
  if (!visible) {
    style["visibility"] = "hidden";
  }
  style["justifyContent"] = textAlign;
  style["color"] = props.foregroundColor?.rgbaString();
  style["backgroundColor"] = props.backgroundColor?.rgbaString();
  // Transparent prop overrides backgroundColor.
  if (transparent) {
    style["backgroundColor"] = "transparent";
  }
  // Simple component to display text - defaults to black text and dark grey background
  return (
    <div className={className} style={style}>
      {props.text}
    </div>
  );
};

export const Label = (props: LabelWidget): JSX.Element => (
  <Widget baseWidget={LabelComponent} {...props} />
);

registerWidget(Label, LabelWidgetProps, "label");
