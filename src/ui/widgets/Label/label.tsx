import React, { CSSProperties } from "react";

import classes from "./label.module.css";
import { Widget, useCommonCss } from "../widget";
import { WidgetPropType } from "../widgetProps";
import { registerWidget } from "../register";
import {
  BoolPropOpt,
  InferWidgetProps,
  StringPropOpt,
  ChoicePropOpt,
  FontPropOpt,
  ColorPropOpt,
  BorderPropOpt
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
  transform: StringPropOpt
};

const LabelWidgetProps = {
  ...LabelProps,
  ...WidgetPropType
};

type LabelWidget = InferWidgetProps<typeof LabelWidgetProps>;

export const LabelComponent = (
  props: InferWidgetProps<typeof LabelProps>
): JSX.Element => {
  const style: CSSProperties = useCommonCss(props);
  const { transparent = false, textAlign = "center", text = "" } = props;
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
  style["color"] = props.foregroundColor?.rgbaString();
  style["backgroundColor"] = props.backgroundColor?.rgbaString();
  // Transparent prop overrides backgroundColor.
  if (transparent) {
    style["backgroundColor"] = "transparent";
  }
  if (props.visible) {
    style["visibility"] = "visible";
  }

  if (props.transform) {
    style["transform"] = props.transform;
  }
  // Simple component to display text - defaults to black text and dark grey background
  return (
    <div className={className} style={style}>
      {text}
    </div>
  );
};

export const Label = (props: LabelWidget): JSX.Element => (
  <Widget baseWidget={LabelComponent} {...props} />
);

registerWidget(Label, LabelWidgetProps, "label");
