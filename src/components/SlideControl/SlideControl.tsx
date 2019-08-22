// Component to allow setting of vakues using a slider.
// Displays value via an embedded progressbar widget

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useSubscription, writePv } from "../../hooks/useCs";
import { CsState } from "../../redux/csState";
import { ProgressBar } from "../ProgressBar/ProgressBar";

import classes from "./SlideControl.module.css";

interface SlideControlProps {
  pvName: string;
  value: number;
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
) => {
  let {
    pvName = "",
    value = 0,
    min = 0,
    max = 100,
    vertical = false,
    color = "#00aa00",
    top = "0%",
    left = "0%",
    height = "100%",
    width = "100%",
    fontStyle = {},
    precision = undefined
  } = props;

  const [inputValue, setInputValue] = useState(0);
  const [editing, setEditing] = useState(false);
  useSubscription(props.pvName);
  /* It would be nice to be able to share a selector, but it's
     not immediately obvious how to make a selector that takes
     an argument other than state. */
  const latestValue: string = useSelector((state: CsState): string => {
    let value = state.valueCache[props.pvName];
    if (value == null) {
      return "0";
    } else {
      return value.value.toString();
    }
  });

  function onChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setInputValue(parseFloat(event.currentTarget.value));
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

  if (!editing && inputValue !== parseFloat(latestValue)) {
    setInputValue(parseFloat(latestValue));
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
        <ProgressBar pvName={pvName} value={inputValue} min={min} max={max} />
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
