import React, { useState } from "react";
import { writePv } from "../hooks/useCs";

interface InputProps {
  value: any;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Input = (props: InputProps) => (
  <input
    type="text"
    value={props.value}
    onKeyDown={props.onKeyDown}
    onChange={props.onChange}
  />
);

interface ConnectedInputProps {
  pvName: string;
}

export const ConnectedInput = (props: ConnectedInputProps) => {
  const [inputValue, setInputValue] = useState("");

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    const target = event.target as HTMLInputElement;
    if (event.key === "Enter") {
      writePv(props.pvName, target.value);
      setInputValue("");
    }
  }
  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const target = event.target as HTMLInputElement;
    setInputValue(target.value);
  }

  return Input({ value: inputValue, onKeyDown: onKeyDown, onChange: onChange });
};
