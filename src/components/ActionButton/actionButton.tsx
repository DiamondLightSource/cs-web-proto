import React from "react";
import { WidgetActions, executeActions } from "../../widgetActions";
import { InferWidgetProps, PVWidget, PVWidgetPropType } from "../Widget/widget";
import classes from "./actionButton.module.css";
import { RouteComponentProps, useHistory } from "react-router-dom";

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
      <div style={props.style}>
        <button className={classes.image} onClick={props.onClick}>
          <img src={props.image} alt={props.image}></img>
          <br></br>
          {props.text}
        </button>
      </div>
    );
  } else {
    return (
      <div style={props.style}>
        <button onClick={props.onClick}>{props.text}</button>
      </div>
    );
  }
};

export interface ActionButtonWidgetProps extends RouteComponentProps {
  text: string;
  actions: WidgetActions;
  style?: {};
  image?: string;
}

// Menu button which also knows how to write to a PV
export const ActionButtonWidget = (
  props: ActionButtonWidgetProps
): JSX.Element => {
  // Function to send the value on to the PV
  const history = useHistory();
  function onClick(event: React.MouseEvent<HTMLButtonElement>): void {
    if (props.actions !== undefined) executeActions(props.actions, history);
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
