import React from "react";
import { PVWidget, PVWidgetInterface } from "../Widget/widget";
import classes from "./basicButton.module.css";
import { Link } from "react-router-dom";

export interface BasicButtonProps {
  text: string;
  style?: object;
  image?: string;
  shape?: string;
}

export const BasicButtonComponent = (props: BasicButtonProps): JSX.Element => {
  if (props.image !== undefined) {
    return (
      <Link to={'/dynamic/ionpExample/{"device":"SR03A-VA-IONP-01"}'}>
        <div className={classes.image}>
          <button>
            <img src={props.image} alt={props.image}></img>
            {props.text}
          </button>
        </div>
      </Link>
    );
  } else {
    return (
      <div>
        <button>{props.text}</button>
      </div>
    );
  }
};

export interface BasicButtonWidgetProps {
  text: string;
  style?: object;
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
