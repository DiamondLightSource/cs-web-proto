import React from "react";
import { Actions, executeActions } from "../../actions";

// For now not a PV widget.
export interface BasicActionButtonProps {
  text: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  style?: {};
}

export const BasicActionButton = (
  props: BasicActionButtonProps
): JSX.Element => {
  return <button onClick={props.onClick}>{props.text}</button>;
};

export interface ActionButtonProps {
  text: string;
  actions: Actions;
  style?: {};
}

// Menu button which also knows how to write to a PV
export const ActionButton = (props: ActionButtonProps): JSX.Element => {
  // Function to send the value on to the PV
  function onClick(event: React.MouseEvent<HTMLButtonElement>): void {
    executeActions(props.actions);
  }

  return (
    <BasicActionButton
      text={props.text}
      style={props.style}
      onClick={onClick}
    />
  );
};
