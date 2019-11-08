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
  shapeColour: PropTypes.string,
  shapeTransform: PropTypes.string
};

export const ShapeComponent = (
  props: InferWidgetProps<typeof ShapeProps> & Component
): JSX.Element => {
  return (
    <div
      style={{
        ...props.style,
        width: props.shapeWidth ? props.shapeWidth : "",
        height: props.shapeHeight ? props.shapeHeight : "",
        borderRadius: props.shapeRadius ? props.shapeRadius : "",
        transform: props.shapeTransform ? props.shapeTransform : "",
        backgroundColor: props.shapeColour ? props.shapeColour : ""
      }}
    ></div>
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
