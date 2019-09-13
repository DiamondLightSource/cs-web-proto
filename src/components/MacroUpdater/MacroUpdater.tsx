import React, { useState } from "react";
import { getStore } from "../../redux/store";
import { MACRO_UPDATED } from "../../redux/actions";
export interface DumbMacroUpdaterProps {
  kkey: string;
  value: string;
  onKeyKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onValueKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onKeyChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onValueChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const DumbMacroUpdater: React.FC<DumbMacroUpdaterProps> = (
  props: DumbMacroUpdaterProps
): JSX.Element => (
  <>
    <input
      type="text"
      value={props.kkey}
      onKeyDown={props.onKeyKeyDown}
      onChange={props.onKeyChange}
    ></input>
    <input
      type="text"
      value={props.value}
      onKeyDown={props.onValueKeyDown}
      onChange={props.onValueChange}
    ></input>
  </>
);

export interface MacroUpdaterProps {}

function updateMacro(key: string, value: string): void {
  console.log(`updating ${key} to ${value}`);
  getStore().dispatch({
    type: MACRO_UPDATED,
    payload: { key: key, value: value }
  });
}

export const MacroUpdater: React.FC<MacroUpdaterProps> = (
  props: MacroUpdaterProps
): JSX.Element => {
  const [keyValue, setKeyValue] = useState("");
  const [valueValue, setValueValue] = useState("");
  function onKeyKeyDown(event: React.KeyboardEvent<HTMLInputElement>): void {
    if (event.key === "Enter") {
      setKeyValue(event.currentTarget.value);
      updateMacro(keyValue, valueValue);
    }
  }
  function onValueKeyDown(event: React.KeyboardEvent<HTMLInputElement>): void {
    if (event.key === "Enter") {
      setValueValue(event.currentTarget.value);
      updateMacro(keyValue, valueValue);
    }
  }
  function onKeyChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setKeyValue(event.currentTarget.value);
  }
  function onValueChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setValueValue(event.currentTarget.value);
  }

  return (
    <DumbMacroUpdater
      kkey={keyValue}
      value={valueValue}
      onKeyKeyDown={onKeyKeyDown}
      onValueKeyDown={onValueKeyDown}
      onKeyChange={onKeyChange}
      onValueChange={onValueChange}
    />
  );
};
