import React, { useState } from "react";

import classes from "./input.module.css";
import { writePv } from "../../hooks/useSubscription";
import { commonCss, Widget } from "../widget";
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
import { AlarmQuality, DType } from "../../../types/dtypes";

export interface InputProps {
  pvName: string;
  value: string;
  readonly: boolean;
  foregroundColor?: Color;
  backgroundColor?: Color;
  transparent: boolean;
  alarm: AlarmQuality;
  alarmSensitive: boolean;
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
  let allClasses = classes.Input;
  const style = commonCss(props);
  if (props.textAlign) {
    style.textAlign = props.textAlign;
  }
  style.color = props.foregroundColor?.toString();
  style.backgroundColor = props.backgroundColor?.toString();
  // Transparent prop overrides backgroundColor.
  if (props.transparent) {
    style["backgroundColor"] = "transparent";
  }
  if (props.readonly) {
    allClasses += ` ${classes.readonly}`;
  }
  if (props.alarmSensitive) {
    switch (props.alarm) {
      case AlarmQuality.UNDEFINED:
      case AlarmQuality.INVALID:
      case AlarmQuality.CHANGING:
        style.color = "var(--invalid)";
        break;
      case AlarmQuality.WARNING:
        style.color = "var(--alarm)";
        break;
      case AlarmQuality.ALARM:
        style.color = "var(--alarm)";
        break;
    }
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
    font?: Font;
    foregroundColor?: Color;
    backgroundColor?: Color;
    transparent?: boolean;
    alarmSensitive?: boolean;
    textAlign?: "left" | "center" | "right";
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

  const alarmQuality = props.value?.getAlarm().quality ?? AlarmQuality.VALID;

  return (
    <InputComponent
      pvName={props.pvName}
      value={inputValue}
      alarm={alarmQuality}
      alarmSensitive={props.alarmSensitive || false}
      readonly={props.readonly}
      foregroundColor={props.foregroundColor}
      backgroundColor={props.backgroundColor}
      transparent={props.transparent ?? false}
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
  alarmSensitive: BoolPropOpt,
  textAlign: ChoicePropOpt(["left", "center", "right"])
};

export const Input = (
  props: InferWidgetProps<typeof InputWidgetProps>
): JSX.Element => <Widget baseWidget={SmartInputComponent} {...props} />;

registerWidget(Input, InputWidgetProps, "input");
