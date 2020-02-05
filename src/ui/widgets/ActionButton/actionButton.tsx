import React, { useContext } from "react";
import { WidgetActions, executeActions } from "../widgetActions";
import { PVWidget, PVWidgetPropType } from "../widget";
import classes from "./actionButton.module.css";
import { useHistory } from "react-router-dom";
import { registerWidget } from "../register";
import {
  ActionsPropType,
  StringProp,
  ObjectPropOpt,
  StringPropOpt,
  InferWidgetProps
} from "../propTypes";
import { BaseUrlContext } from "../../../baseUrl";

export interface ActionButtonProps {
  text: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  image?: string;
  backgroundColor?: string;
  foregroundColor?: string;
}

export const ActionButtonComponent = (
  props: ActionButtonProps
): JSX.Element => {
  const baseUrl = useContext(BaseUrlContext);
  let src = props.image;
  if (src !== undefined && !src?.startsWith("http")) {
    src = `${baseUrl}/img/${src}`;
  }
  return (
    <button
      className={classes.actionbutton}
      onClick={props.onClick}
      style={{
        height: "100%",
        width: "100%",
        textAlign: "center",
        backgroundColor: props.backgroundColor
      }}
    >
      {src !== undefined ? (
        <figure className={classes.figure}>
          <img src={src} alt={props.image}></img>
          <figcaption>{props.text}</figcaption>
        </figure>
      ) : (
        props.text
      )}
    </button>
  );
};

const ActionButtonPropType = {
  text: StringProp,
  actions: ActionsPropType,
  positionStyle: ObjectPropOpt,
  image: StringPropOpt,
  backgroundColor: StringPropOpt,
  foregroundColor: StringPropOpt
};

const ActionButtonProps = {
  ...ActionButtonPropType,
  ...PVWidgetPropType
};

// Menu button which also knows how to write to a PV
export const ActionButtonWidget = (
  props: InferWidgetProps<typeof ActionButtonPropType>
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
      onClick={onClick}
      image={props.image}
      backgroundColor={props.backgroundColor}
      foregroundColor={props.foregroundColor}
    />
  );
};

export const ActionButton = (
  props: InferWidgetProps<typeof ActionButtonProps>
): JSX.Element => <PVWidget baseWidget={ActionButtonWidget} {...props} />;

registerWidget(ActionButton, ActionButtonProps, "actionbutton");
