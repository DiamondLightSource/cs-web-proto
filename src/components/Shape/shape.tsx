import React from "react";
import PropTypes from "prop-types";
import {
  Component,
  Widget,
  WidgetPropType,
  InferWidgetProps
} from "../Widget/widget";
import { registerWidget } from "../register";

const ShapeProps = {
  shapeWidth: PropTypes.string,
  shapeHeight: PropTypes.string,
  shapeRadius: PropTypes.string,
  shapeTransform: PropTypes.string,
  transparent: PropTypes.bool
};

export const ShapeComponent = (
  props: InferWidgetProps<typeof ShapeProps> & Component
): JSX.Element => {
  const newStyle: any = {
    ...props.style,
    width: props.shapeWidth ? props.shapeWidth : "100%",
    height: props.shapeHeight ? props.shapeHeight : "100%",
    borderRadius: props.shapeRadius ? props.shapeRadius : "",
    transform: props.shapeTransform ? props.shapeTransform : ""
  };

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
