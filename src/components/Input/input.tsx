import React, { useState } from "react";
import { connectionWrapper } from "../ConnectionWrapper/connectionWrapper";
import { writePv } from "../../hooks/useCs";
import { VType } from "../../vtypes/vtypes";
import { CopyWrapper } from "../CopyWrapper/copyWrapper";
import { AlarmBorder } from "../AlarmBorder/alarmBorder";

import classes from "./input.module.css";
import { macroWrapper } from "../MacroWrapper/macroWrapper";
import { vtypeToString, stringToVtype } from "../../vtypes/utils";
import {
  Widget,
  PVWidgetInterface,
  ConnectedWidgetInterface
} from "../Widget/widget";

export interface InputProps {
  pvName: string;
  value: string;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClick: (event: React.MouseEvent<HTMLInputElement>) => void;
  style?: object;
}

export const Input: React.FC<InputProps> = (props: InputProps): JSX.Element => (
  <input
    type="text"
    value={props.value}
    onKeyDown={props.onKeyDown}
    onChange={props.onChange}
    onBlur={props.onBlur}
    onClick={props.onClick}
    className={`Input ${classes.Input}`}
    style={props.style}
  />
);

interface ConnectedInputProps {
  pvName: string;
  style?: object;
}

interface SmartInputProps {
  pvName: string;
  value?: VType;
  style?: object;
}

export const SmartInput: React.FC<SmartInputProps> = (
  props: SmartInputProps
): JSX.Element => {
  const [inputValue, setInputValue] = useState("");
  const [editing, setEditing] = useState(false);
  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>): void {
    if (event.key === "Enter") {
      writePv(props.pvName, stringToVtype(event.currentTarget.value));
      setInputValue("");
      setEditing(false);
    }
  }
  function onChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setInputValue(event.currentTarget.value);
  }
  function onClick(event: React.MouseEvent<HTMLInputElement>): void {
    /* When focus gained allow editing. */
    if (!editing) {
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
    <Input
      pvName={props.pvName}
      value={inputValue}
      onKeyDown={onKeyDown}
      onChange={onChange}
      onBlur={onBlur}
      onClick={onClick}
      style={props.style}
    />
  );
};

export const ConnectedInput: React.FC<ConnectedInputProps> = macroWrapper(
  connectionWrapper(SmartInput)
);

interface ConnectedStandaloneInputProps {
  pvName: string;
  precision?: number;
  style?: {};
}

export const StandaloneInput = (props: {
  pvName: string;
  rawPvName?: string;
  value: VType;
  connected: boolean;
  precision?: number;
  style?: object;
}): JSX.Element => (
  <CopyWrapper
    pvName={props.pvName}
    rawPvName={props.rawPvName}
    connected={props.connected}
    value={props.value}
  >
    <AlarmBorder connected={props.connected} value={props.value}>
      <SmartInput pvName={props.pvName} value={props.value}></SmartInput>
    </AlarmBorder>
  </CopyWrapper>
);

export const ConnectedStandaloneInput: React.FC<
  ConnectedStandaloneInputProps
> = macroWrapper(connectionWrapper(StandaloneInput));

interface InputWidgetProps {
  precision?: number;
}

export const InputWidget = (
  props: InputWidgetProps & PVWidgetInterface
): JSX.Element => {
  return <Widget baseWidget={SmartInput} {...props} />;
};

export const ConnectedInputWidget: React.FC<
  InputWidgetProps & ConnectedWidgetInterface
> = macroWrapper(connectionWrapper(InputWidget));
