import React from "react";
import { Actions, executeActions } from "../../actions";
import { InferWidgetProps, PVWidget, PVWidgetPropType } from "../Widget/widget";
import classes from "./actionButton.module.css";

export interface ActionButtonProps {
  text: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  style?: {};
  image?: string;
}

export const ActionButtonComponent = (
  props: ActionButtonProps
): JSX.Element => {
  if (props.image !== undefined) {
    return (
      <button className={classes.image} onClick={props.onClick}>
        <img src={props.image} alt={props.image}></img>
        <br></br>
        {props.text}
      </button>
    );
  } else {
    return <button onClick={props.onClick}>{props.text}</button>;
  }
};

export interface ActionButtonWidgetProps {
  text: string;
  actions: Actions;
  style?: {};
  image?: string;
}

// Menu button which also knows how to write to a PV
export const ActionButtonWidget = (
  props: ActionButtonWidgetProps
): JSX.Element => {
  // Function to send the value on to the PV
  function onClick(event: React.MouseEvent<HTMLButtonElement>): void {
    if (props.actions !== undefined) executeActions(props.actions);
  }
  return (
    <ActionButtonComponent
      text={props.text}
      style={props.style}
      onClick={onClick}
      image={props.image}
    />
  );
};

export const ActionButton = (
  props: InferWidgetProps<typeof PVWidgetPropType>
): JSX.Element => <PVWidget baseWidget={ActionButtonWidget} {...props} />;

ActionButton.propTypes = PVWidgetPropType;
