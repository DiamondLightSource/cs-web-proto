import React from "react";
import { PVWidget, PVWidgetInterface } from "../Widget/widget";
import classes from "./basicButton.module.css";
import { Link } from "react-router-dom";
import { transform } from "@babel/core";

export interface ShapeProps {
  shapeWidth?: string;
  shapeHeight?: string;
  shapeRadius?: string;
  shapeColour?: string;
  shapeTransform?: string;
  style?: object;
}

export const ShapeComponent = (props: ShapeProps): JSX.Element => {
  var style = {
    backgroundColor: props.shapeColour,
    width: props.shapeWidth,
    height: props.shapeHeight,
    borderRadius: props.shapeRadius,
    transform: props.shapeTransform
  };
  return <div style={style}></div>;
};

export interface ShapeWidgetProps {
  shapeWidth?: string;
  shapeHeight?: string;
  shapeRadius?: string;
  shapeColour?: string;
  shapeTransform?: string;
  style?: object;
}

export const Shape = (props: ShapeWidgetProps): JSX.Element => {
  return (
    <ShapeComponent
      shapeWidth={props.shapeWidth}
      shapeHeight={props.shapeHeight}
      shapeRadius={props.shapeRadius}
      shapeColour={props.shapeColour}
      shapeTransform={props.shapeTransform}
      style={props.style}
    />
  );
};

export const ShapeWidget = (
  props: ShapeWidgetProps & PVWidgetInterface
): JSX.Element => <PVWidget baseWidget={Shape} {...props} />;
