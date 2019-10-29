import React from "react";
import { PVWidget, PVWidgetInterface } from "../Widget/widget";

export interface BasicButtonProps {
  text: string;
  style?: {};
}

export const BasicButtonComponent = (props: BasicButtonProps): JSX.Element => {
  return <button>{props.text}</button>;
};

export interface BasicButtonWidgetProps {
  text: string;
  style?: {};
}

export const BasicButtonWidget = (
  props: BasicButtonWidgetProps
): JSX.Element => {
  return <BasicButtonComponent text={props.text} style={props.style} />;
};

export const BasicButton = (
  props: BasicButtonWidgetProps & PVWidgetInterface
): JSX.Element => <PVWidget baseWidget={BasicButtonWidget} {...props} />;
