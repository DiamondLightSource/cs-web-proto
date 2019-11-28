import React from "react";
import PropTypes from "prop-types";
import {
  Component,
  Widget,
  WidgetPropType,
  InferWidgetProps
} from "../Widget/widget";

const ShapeProps = {
  shapeWidth: PropTypes.string,
  shapeHeight: PropTypes.string,
  shapeRadius: PropTypes.string,
  shapeTransform: PropTypes.string
};

export const ShapeComponent = (
  props: InferWidgetProps<typeof ShapeProps> & Component
): JSX.Element => {
  return (
    <div
      style={{
        ...props.style,
        width: props.shapeWidth ? props.shapeWidth : "100%",
        height: props.shapeHeight ? props.shapeHeight : "100%",
        borderRadius: props.shapeRadius ? props.shapeRadius : "",
        transform: props.shapeTransform ? props.shapeTransform : ""
      }}
    />
  );
};

const ShapeWidgetProps = {
  ...ShapeProps,
  ...WidgetPropType
};

export const Shape = (
  props: InferWidgetProps<typeof ShapeWidgetProps>
): JSX.Element => <Widget baseWidget={ShapeComponent} {...props} />;

Shape.propTypes = ShapeWidgetProps;
