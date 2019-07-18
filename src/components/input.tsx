import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useSubscription, writePv } from "../hooks/useCs";

interface InputProps {
  value: any;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClick: (event: React.MouseEvent<HTMLInputElement>) => void;
}

export const Input = (props: InputProps) => (
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

export const ConnectedInput = (props: ConnectedInputProps) => {
  const [inputValue, setInputValue] = useState("");
  const [editing, setEditing] = useState(false);
  useSubscription(props.pvName);
  /* It would be nice to be able to share a selector, but it's
     not immediately obvious how to make a selector that takes
     an argument other than state. */
  const latestValue = useSelector((state: any) => {
    let value = state.valueCache[props.pvName];
    if (value == null) {
      value = "";
    }
    return value;
  });
  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      writePv(props.pvName, event.currentTarget.value);
      setInputValue("");
    }
  }
  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(event.currentTarget.value);
  }
  function onClick(event: any) {
    /* When focus gained allow editing. */
    if (!editing) {
      setInputValue("");
      setEditing(true);
    }
  }
  function onBlur(event: any) {
    setEditing(false);
    /* When focus lost show PV value. */
    setInputValue(latestValue);
  }

  if (!editing && inputValue !== latestValue) {
    setInputValue(latestValue);
  }

  return Input({
    value: inputValue,
    onKeyDown: onKeyDown,
    onChange: onChange,
    onBlur: onBlur,
    onClick: onClick
  });
};
