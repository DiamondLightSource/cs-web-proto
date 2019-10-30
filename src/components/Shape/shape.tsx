import React from "react";
import { PVWidget, PVWidgetInterface } from "../Widget/widget";
import classes from "./basicButton.module.css";
import { Link } from "react-router-dom";

export interface ShapeProps {
  style?: object;
}

export const ShapeComponent = (props: ShapeProps): JSX.Element => {
  return <div style={props.style}></div>;
};

export interface ShapeWidgetProps {
  style?: object;
}

export const ShapeWidget = (props: ShapeWidgetProps): JSX.Element => {
  return <ShapeComponent style={props.style} />;
};

export const Shape = (
  props: ShapeWidgetProps & PVWidgetInterface
): JSX.Element => <PVWidget baseWidget={ShapeWidget} {...props} />;
