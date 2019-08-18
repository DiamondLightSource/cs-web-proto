import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useSubscription, writePv } from "../hooks/useCs";
import { CsState } from "../redux/csState";

export interface InputProps {
  value: string;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClick: (event: React.MouseEvent<HTMLInputElement>) => void;
}

export const Input: React.FC<InputProps> = (props: InputProps): JSX.Element => (
  <input
    type="text"
    value={props.value}
    onKeyDown={props.onKeyDown}
    onChange={props.onChange}
    onBlur={props.onBlur}
    onClick={props.onClick}
  />
);

interface ConnectedInputProps {
  pvName: string;
}

export const ConnectedInput: React.FC<ConnectedInputProps> = (
  props: ConnectedInputProps
): JSX.Element => {
  const [inputValue, setInputValue] = useState("");
  const [editing, setEditing] = useState(false);
  useSubscription(props.pvName);
  /* It would be nice to be able to share a selector, but it's
     not immediately obvious how to make a selector that takes
     an argument other than state. */
  const latestValue: string = useSelector((state: CsState): string => {
    let value = state.valueCache[props.pvName];
    if (value == null) {
      return "";
    } else {
      return value.value.toString();
    }
  });
  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>): void {
    if (event.key === "Enter") {
      writePv(props.pvName, {
        type: "NTScalar",
        value: event.currentTarget.value
      });
      setInputValue("");
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
    setInputValue(latestValue);
  }

  if (!editing && inputValue !== latestValue) {
    setInputValue(latestValue);
  }

  return (
    <Input
      value={inputValue}
      onKeyDown={onKeyDown}
      onChange={onChange}
      onBlur={onBlur}
      onClick={onClick}
    />
  );
};
