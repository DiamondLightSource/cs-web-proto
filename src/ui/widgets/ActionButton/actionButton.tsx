import React, { useContext } from "react";
import { WidgetActions, executeActions } from "../widgetActions";
import { commonCss, Widget } from "../widget";
import { PVWidgetPropType } from "../widgetProps";
import classes from "./actionButton.module.css";
import { registerWidget } from "../register";
import {
  ActionsPropType,
  StringPropOpt,
  InferWidgetProps,
  ColorPropOpt,
  FontPropOpt,
  BorderPropOpt
} from "../propTypes";
import { Color } from "../../../types/color";
import { Font } from "../../../types/font";
import { Border, BorderStyle } from "../../../types/border";
import { MacroContext } from "../../../types/macros";
import { FileContext } from "../../../fileContext";

export interface ActionButtonProps {
  text: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  image?: string;
  backgroundColor?: Color;
  foregroundColor?: Color;
  border?: Border;
  font?: Font;
  actions?: WidgetActions;
}

export const ActionButtonComponent = (
  props: ActionButtonProps
): JSX.Element => {
  const style = commonCss(props);
  style["whiteSpace"] = "normal";
  // Use default button style if no border defined.
  if (props.border?.style === BorderStyle.None) {
    style["borderStyle"] = undefined;
    style["borderWidth"] = undefined;
    style["borderColor"] = undefined;
    style["padding"] = "0";
  }
  return (
    <button
      className={classes.actionbutton}
      onClick={props.onClick}
      style={style}
    >
      {props.image !== undefined ? (
        <figure className={classes.figure}>
          <img src={props.image} alt={props.image}></img>
          <figcaption>{props.text}</figcaption>
        </figure>
      ) : (
        <span style={{ whiteSpace: "normal" }}>{props.text}</span>
      )}
    </button>
  );
};

const ActionButtonPropType = {
  text: StringPropOpt,
  actions: ActionsPropType,
  image: StringPropOpt,
  backgroundColor: ColorPropOpt,
  foregroundColor: ColorPropOpt,
  font: FontPropOpt,
  border: BorderPropOpt
};

const ActionButtonWidgetProps = {
  ...ActionButtonPropType,
  ...PVWidgetPropType
};

// Menu button which also knows how to write to a PV
export const ActionButtonWidget = (
  props: InferWidgetProps<typeof ActionButtonPropType>
): JSX.Element => {
  // Function to send the value on to the PV
  const files = useContext(FileContext);
  const parentMacros = useContext(MacroContext).macros;
  function onClick(event: React.MouseEvent<HTMLButtonElement>): void {
    if (props.actions !== undefined)
      executeActions(props.actions as WidgetActions, files, parentMacros);
  }
  return (
    <ActionButtonComponent
      text={props.text ?? ""}
      onClick={onClick}
      image={props.image}
      backgroundColor={props.backgroundColor}
      foregroundColor={props.foregroundColor}
      font={props.font}
      border={props.border}
      actions={props.actions as WidgetActions}
    />
  );
};

export const ActionButton = (
  props: InferWidgetProps<typeof ActionButtonWidgetProps>
): JSX.Element => <Widget baseWidget={ActionButtonWidget} {...props} />;

registerWidget(ActionButton, ActionButtonWidgetProps, "actionbutton");
