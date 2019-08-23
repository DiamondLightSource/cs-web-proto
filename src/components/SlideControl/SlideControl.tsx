// Component to allow setting of values using a slider.
// Displays value via an embedded progressbar widget

import React, { useState } from "react";
import { ProgressBar } from "../ProgressBar/ProgressBar";
import { writePv } from "../../hooks/useCs";

import classes from "./SlideControl.module.css";
import { connectionWrapper } from "../ConnectionWrapper/ConnectionWrapper";

interface SlideControlProps {
  pvName: string;
  value: string;
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
}

export const SlideControl: React.FC<SlideControlProps> = (
  props: SlideControlProps
): JSX.Element => {
  let {
    pvName = "",
    value = "",
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
    writePv(pvName, {
      type: "NTScalar",
      value: event.currentTarget.value
    });
  }

  if (!editing && inputValue !== value) {
    setInputValue(value);
  }

  return (
    <div style={{ border: "solid 1px red" }}>
      <div
        style={{
          display: "block",
          position: "absolute",
          height: "80%",
          width: "100%",
          top: "0%",
          left: "0%"
        }}
      >
        <ProgressBar
          pvName={pvName}
          value={value.toString()}
          min={min}
          max={max}
          precision={precision}
        />
      </div>
      <div
        style={{
          display: "block",
          position: "absolute",
          height: "20%",
          width: "100%",
          bottom: "0%",
          left: "0%"
        }}
      >
        <input
          className={classes.Slider}
          type="range"
          min={min}
          max={max}
          value={inputValue}
          onChange={onChange}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
        ></input>
      </div>
    </div>
  );
};

export const ConnectedSlideControl = connectionWrapper(SlideControl);
