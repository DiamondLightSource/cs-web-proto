import React from "react";
import { Actions, executeActions } from "../../actions";
import { PVWidget, PVWidgetInterface } from "../Widget/widget";

export interface ActionButtonProps {
  text: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  style?: {};
}

export const ActionButtonComponent = (
  props: ActionButtonProps
): JSX.Element => {
  return <button onClick={props.onClick}>{props.text}</button>;
};

export interface ActionButtonWidgetProps {
  text: string;
  actions: Actions;
  style?: {};
}

// Menu button which also knows how to write to a PV
export const ActionButtonWidget = (
  props: ActionButtonWidgetProps
): JSX.Element => {
  // Function to send the value on to the PV
  function onClick(event: React.MouseEvent<HTMLButtonElement>): void {
    executeActions(props.actions);
  }

  return (
    <ActionButtonComponent
      text={props.text}
      style={props.style}
      onClick={onClick}
    />
  );
};

export const ActionButton = (
  props: ActionButtonWidgetProps & PVWidgetInterface
): JSX.Element => <PVWidget baseWidget={ActionButtonWidget} {...props} />;
