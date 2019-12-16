import React from "react";
import PropTypes from "prop-types";
import { WidgetActions, executeActions } from "../../widgetActions";
import {
  InferWidgetProps,
  PVComponent,
  PVWidget,
  PVWidgetPropType
} from "../Widget/widget";
import classes from "./actionButton.module.css";
import { useHistory } from "react-router-dom";
import { registerWidget } from "../register";
import { ActionsPropType } from "../propTypes";

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
      <button
        className={classes.image}
        onClick={props.onClick}
        style={props.style}
      >
        <img src={props.image} alt={props.image}></img>
        <br></br>
        {props.text}
      </button>
    );
  } else {
    return (
      <button
        className={classes.actionbutton}
        onClick={props.onClick}
        style={props.style}
      >
        {props.text}
      </button>
    );
  }
};

const ActionButtonPropType = {
  text: PropTypes.string.isRequired,
  actions: ActionsPropType,
  style: PropTypes.object,
  image: PropTypes.string
};

const ActionButtonProps = {
  ...ActionButtonPropType,
  ...PVWidgetPropType
};

// Menu button which also knows how to write to a PV
export const ActionButtonWidget = (
  props: InferWidgetProps<typeof ActionButtonPropType> & PVComponent
): JSX.Element => {
  // Function to send the value on to the PV
  const history = useHistory();
  function onClick(event: React.MouseEvent<HTMLButtonElement>): void {
    if (props.actions !== undefined)
      executeActions(props.actions as WidgetActions, history);
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
  props: InferWidgetProps<typeof ActionButtonProps>
): JSX.Element => <PVWidget baseWidget={ActionButtonWidget} {...props} />;

registerWidget(ActionButton, ActionButtonProps, "actionbutton");
