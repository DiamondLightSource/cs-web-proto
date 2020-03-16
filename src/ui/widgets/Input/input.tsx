import React, { useState } from "react";

import classes from "./input.module.css";
import { writePv } from "../../hooks/useSubscription";
import { vtypeToString, stringToVtype } from "../../../types/vtypes/utils";
import { Widget } from "../widget";
import { PVInputComponent, PVWidgetPropType } from "../widgetProps";
import { registerWidget } from "../register";
import { InferWidgetProps, FontPropOpt } from "../propTypes";
import { Font } from "../../../types/font";

export interface InputProps {
  pvName: string;
  value: string;
  readonly: boolean;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClick: (event: React.MouseEvent<HTMLInputElement>) => void;
  font?: Font;
}

export const InputComponent: React.FC<InputProps> = (
  props: InputProps
): JSX.Element => {
  let allClasses = `Input ${classes.Input}`;
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
      style={props.font?.css()}
      readOnly={props.readonly}
    />
  );
};

export const SmartInputComponent = (
  props: PVInputComponent & { font: Font }
): JSX.Element => {
  const [inputValue, setInputValue] = useState("");
  const [editing, setEditing] = useState(false);
  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>): void {
    if (event.key === "Enter") {
      writePv(props.pvName, stringToVtype(event.currentTarget.value));
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
    setInputValue(vtypeToString(props.value));
  }

  if (!editing && inputValue !== vtypeToString(props.value)) {
    setInputValue(vtypeToString(props.value));
  }

  return (
    <InputComponent
      pvName={props.pvName}
      value={inputValue}
      readonly={props.readonly}
      onKeyDown={onKeyDown}
      onChange={onChange}
      onBlur={onBlur}
      onClick={onClick}
      font={props.font}
    />
  );
};

const InputWidgetProps = {
  ...PVWidgetPropType,
  font: FontPropOpt
};

export const Input = (
  props: InferWidgetProps<typeof InputWidgetProps>
): JSX.Element => <Widget baseWidget={SmartInputComponent} {...props} />;

registerWidget(Input, PVWidgetPropType, "input");
