import React from "react";
import { PVWidget, PVWidgetInterface } from "../Widget/widget";
import classes from "./basicButton.module.css";

export interface BasicButtonProps {
  text: string;
  style?: {};
  image?: string;
}

export const BasicButtonComponent = (props: BasicButtonProps): JSX.Element => {
  if (props.image !== undefined) {
    return (
      <button className={classes.image}>
        <img src={props.image} alt={props.image}></img>
        <br></br>
        {props.text}
      </button>
    );
  } else {
    return <button>{props.text}</button>;
  }
};

export interface BasicButtonWidgetProps {
  text: string;
  style?: {};
  image?: string;
}

export const BasicButtonWidget = (
  props: BasicButtonWidgetProps
): JSX.Element => {
  return (
    <BasicButtonComponent
      text={props.text}
      style={props.style}
      image={props.image}
    />
  );
};

export const BasicButton = (
  props: BasicButtonWidgetProps & PVWidgetInterface
): JSX.Element => <PVWidget baseWidget={BasicButtonWidget} {...props} />;
