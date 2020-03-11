import React from "react";
import { Widget } from "../widget";
import { WidgetPropType } from "../widgetProps";
import { registerWidget } from "../register";
import {
  BoolPropOpt,
  StringPropOpt,
  InferWidgetProps,
  BorderPropOpt,
  ColorPropOpt
} from "../propTypes";

const ShapeProps = {
  shapeWidth: StringPropOpt,
  shapeHeight: StringPropOpt,
  shapeRadius: StringPropOpt,
  shapeTransform: StringPropOpt,
  transparent: BoolPropOpt,
  backgroundColor: ColorPropOpt,
  border: BorderPropOpt
};

export const ShapeComponent = (
  props: InferWidgetProps<typeof ShapeProps>
): JSX.Element => {
  const newStyle: any = {
    width: props.shapeWidth ? props.shapeWidth : "100%",
    height: props.shapeHeight ? props.shapeHeight : "100%",
    borderRadius: props.shapeRadius ? props.shapeRadius : "",
    transform: props.shapeTransform ? props.shapeTransform : "",
    ...props.border?.asStyle()
  };
  newStyle["backgroundColor"] = props.backgroundColor?.rgbaString();
  if (props.transparent !== undefined && props.transparent) {
    newStyle["backgroundColor"] = "transparent";
  }
  return <div style={newStyle} />;
};

const ShapeWidgetProps = {
  ...ShapeProps,
  ...WidgetPropType
};

export const Shape = (
  props: InferWidgetProps<typeof ShapeWidgetProps>
): JSX.Element => <Widget baseWidget={ShapeComponent} {...props} />;

registerWidget(Shape, ShapeWidgetProps, "shape");
