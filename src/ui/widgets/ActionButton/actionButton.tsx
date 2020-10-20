import React, { useContext } from "react";
import { WidgetActions, executeActions } from "../widgetActions";
import { useCommonCss, Widget } from "../widget";
import { PVWidgetPropType } from "../widgetProps";
import classes from "./actionButton.module.css";
import { registerWidget } from "../register";
import {
  ActionsPropType,
  StringProp,
  StringPropOpt,
  InferWidgetProps,
  ColorPropOpt,
  FontPropOpt,
  BorderPropOpt
} from "../propTypes";
import { BaseUrlContext } from "../../../baseUrl";
import { Color } from "../../../types/color";
import { Font } from "../../../types/font";
import { Border } from "../../../types/border";
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
}

export const ActionButtonComponent = (
  props: ActionButtonProps
): JSX.Element => {
  const baseUrl = useContext(BaseUrlContext);
  const style = useCommonCss(props);
  let src = props.image;
  if (src !== undefined && !src?.startsWith("http")) {
    src = `${baseUrl}/img/${src}`;
  }
  return (
    <button
      className={classes.actionbutton}
      onClick={props.onClick}
      style={style}
    >
      {src !== undefined ? (
        <figure className={classes.figure}>
          <img src={src} alt={props.image}></img>
          <figcaption>{props.text}</figcaption>
        </figure>
      ) : (
        <span>{props.text}</span>
      )}
    </button>
  );
};

const ActionButtonPropType = {
  text: StringProp,
  actions: ActionsPropType,
  image: StringPropOpt,
  backgroundColor: ColorPropOpt,
  foregroundColor: ColorPropOpt,
  font: FontPropOpt,
  border: BorderPropOpt
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
  const files = useContext(FileContext);
  const parentMacros = useContext(MacroContext).macros;
  function onClick(event: React.MouseEvent<HTMLButtonElement>): void {
    if (props.actions !== undefined)
      executeActions(props.actions as WidgetActions, files, parentMacros);
  }
  return (
    <ActionButtonComponent
      text={props.text}
      onClick={onClick}
      image={props.image}
      backgroundColor={props.backgroundColor}
      foregroundColor={props.foregroundColor}
      font={props.font}
      border={props.border}
    />
  );
};

export const ActionButton = (
  props: InferWidgetProps<typeof ActionButtonProps>
): JSX.Element => <Widget baseWidget={ActionButtonWidget} {...props} />;

registerWidget(ActionButton, ActionButtonProps, "actionbutton");
