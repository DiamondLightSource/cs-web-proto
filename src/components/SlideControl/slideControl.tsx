// Component to allow setting of values using a slider.
// Displays value via an embedded progressbar widget

import React, { useState } from "react";
import { ProgressBar } from "../ProgressBar/progressBar";
import { writePv } from "../../hooks/useCs";
import { VType } from "../../vtypes/vtypes";

import classes from "./slideControl.module.css";
import { connectionWrapper } from "../ConnectionWrapper/connectionWrapper";
import { vtypeToString, stringToVtype } from "../../vtypes/utils";

interface SlideControlProps {
  pvName: string;
  connected: boolean;
  value?: VType;
  min: number;
  max: number;
  vertical?: boolean;
  color?: string;
  top?: string;
  left?: string;
  height?: string;
  width?: string;
  fontStyle?: object;
  precision?: number;
  style?: object;
}

export const SlideControl: React.FC<SlideControlProps> = (
  props: SlideControlProps
): JSX.Element => {
  let {
    pvName,
    connected,
    value,
    min = 0,
    max = 100,
    /* TODO: Implement vertical style and allow absolute positioning */
    //vertical = false,
    //color = "#00aa00",
    //top = "0%",
    //left = "0%",
    //height = "100%",
    //width = "100%",
    //fontStyle = {},
    precision = undefined
  } = props;

  const [inputValue, setInputValue] = useState("");
  const [editing, setEditing] = useState(false);

  function onChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setInputValue(event.currentTarget.value);
  }

  function onMouseDown(event: React.MouseEvent<HTMLInputElement>): void {
    setEditing(true);
  }
  function onMouseUp(event: React.MouseEvent<HTMLInputElement>): void {
    setEditing(false);
    writePv(pvName, stringToVtype(event.currentTarget.value));
  }

  let stringValue = vtypeToString(value);
  if (!editing && inputValue !== stringValue) {
    setInputValue(stringValue);
  }

  return (
    <div style={{ border: "solid 1px red" }}>
      <div
        style={{
          display: "block",
          position: "absolute",
          height: "90%",
          width: "100%",
          top: "0%",
          left: "0%"
        }}
      >
        <ProgressBar
          connected={connected}
          value={value}
          min={min}
          max={max}
          precision={precision}
        />
      </div>
      <div
        style={{
          display: "block",
          position: "absolute",
          height: "10%",
          width: "100%",
          bottom: "0%",
          left: "0%"
        }}
      >
        <input
          className={`Slider ${classes.Slider}`}
          type="range"
          min={min}
          max={max}
          value={inputValue}
          onChange={onChange}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          style = {props.style}
        ></input>
      </div>
    </div>
  );
};

export const ConnectedSlideControl = connectionWrapper(SlideControl);
