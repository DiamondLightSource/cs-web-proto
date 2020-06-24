import React, { useState, CSSProperties } from "react";

import classes from "./input.module.css";
import { writePv } from "../../hooks/useSubscription";
import { Widget } from "../widget";
import { PVInputComponent, PVWidgetPropType } from "../widgetProps";
import { registerWidget } from "../register";
import {
  InferWidgetProps,
  FontPropOpt,
  ChoicePropOpt,
  ColorPropOpt,
  BoolPropOpt
} from "../propTypes";
import { Font } from "../../../types/font";
import { Color } from "../../../types/color";
import { DType } from "../../../types/dtypes";

export interface InputProps {
  pvName: string;
  value: string;
  readonly: boolean;
  foregroundColor: Color;
  backgroundColor: Color;
  transparent: boolean;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClick: (event: React.MouseEvent<HTMLInputElement>) => void;
  font?: Font;
  textAlign?: "left" | "center" | "right";
}

export const InputComponent: React.FC<InputProps> = (
  props: InputProps
): JSX.Element => {
  let allClasses = `Input ${classes.Input}`;
  const style: CSSProperties = {
    ...props.font?.css()
  };
  if (props.textAlign) {
    style.textAlign = props.textAlign;
  }
  style.color = props.foregroundColor?.rgbaString();
  style.backgroundColor = props.backgroundColor?.rgbaString();
  // Transparent prop overrides backgroundColor.
  if (props.transparent) {
    style["backgroundColor"] = "transparent";
  }
  if (props.readonly) {
    allClasses += ` ${classes.Readonly}`;
  }
  return (
    <input
      type="text"
      value={props.value}
      onKeyDown={props.onKeyDown}
      onChange={props.onChange}
      onBlur={props.onBlur}
      onClick={props.onClick}
      className={allClasses}
      style={style}
      readOnly={props.readonly}
    />
  );
};

export const SmartInputComponent = (
  props: PVInputComponent & {
    font: Font;
    foregroundColor: Color;
    backgroundColor: Color;
    transparent: boolean;
    textAlign: "left" | "center" | "right";
  }
): JSX.Element => {
  const [inputValue, setInputValue] = useState("");
  const [editing, setEditing] = useState(false);
  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>): void {
    if (event.key === "Enter") {
      writePv(
        props.pvName,
        new DType({ stringValue: event.currentTarget.value })
      );
      setInputValue("");
      setEditing(false);
      event.currentTarget.blur();
    }
  }
  function onChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setInputValue(event.currentTarget.value);
  }
  function onClick(event: React.MouseEvent<HTMLInputElement>): void {
    /* When focus gained allow editing. */
    if (!props.readonly && !editing) {
      setInputValue("");
      setEditing(true);
    }
  }
  function onBlur(event: React.ChangeEvent<HTMLInputElement>): void {
    setEditing(false);
    /* When focus lost show PV value. */
    setInputValue(DType.coerceString(props.value));
  }

  if (!editing && inputValue !== DType.coerceString(props.value)) {
    setInputValue(DType.coerceString(props.value));
  }

  return (
    <InputComponent
      pvName={props.pvName}
      value={inputValue}
      readonly={props.readonly}
      foregroundColor={props.foregroundColor}
      backgroundColor={props.backgroundColor}
      transparent={props.transparent}
      onKeyDown={onKeyDown}
      onChange={onChange}
      onBlur={onBlur}
      onClick={onClick}
      font={props.font}
      textAlign={props.textAlign}
    />
  );
};

const InputWidgetProps = {
  ...PVWidgetPropType,
  font: FontPropOpt,
  foregroundColor: ColorPropOpt,
  backgroundColor: ColorPropOpt,
  transparent: BoolPropOpt,
  textAlign: ChoicePropOpt(["left", "center", "right"])
};

export const Input = (
  props: InferWidgetProps<typeof InputWidgetProps>
): JSX.Element => <Widget baseWidget={SmartInputComponent} {...props} />;

registerWidget(Input, InputWidgetProps, "input");
