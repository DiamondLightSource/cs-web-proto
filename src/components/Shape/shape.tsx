import React from "react";
import PropTypes from "prop-types";
import { Component, Widget, WidgetPropType } from "../Widget/widget";
// @ts-ignore
import checkPropTypes from "check-prop-types";

const ShapeProps = {
  shapeWidth: PropTypes.string,
  shapeHeight: PropTypes.string,
  shapeRadius: PropTypes.string,
  shapeColour: PropTypes.string,
  shapeTransform: PropTypes.string
};

export const ShapeComponent = (
  props: PropTypes.InferProps<typeof ShapeProps> & Component
): JSX.Element => {
  let error: string | undefined = checkPropTypes(ShapeProps, { props });
  if (error !== undefined) throw error;
  return (
    <div
      style={{
        width: props.shapeWidth !== null ? props.shapeWidth : "",
        height: props.shapeHeight !== null ? props.shapeHeight : "",
        borderRadius: props.shapeRadius !== null ? props.shapeRadius : "",
        transform: props.shapeTransform !== null ? props.shapeTransform : "",
        backgroundColor: props.shapeColour !== null ? props.shapeColour : ""
      }}
    ></div>
  );
};

const ShapeWidgetProps = {
  ...ShapeProps,
  ...WidgetPropType
};

export const Shape = (
  props: PropTypes.InferProps<typeof ShapeWidgetProps>
): JSX.Element => <Widget baseWidget={ShapeComponent} {...props} />;

Shape.propTypes = ShapeWidgetProps;
