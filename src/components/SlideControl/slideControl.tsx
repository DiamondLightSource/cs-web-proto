// Component to allow setting of values using a slider.
// Displays value via an embedded progressbar widget

import React, { useState } from "react";

import classes from "./slideControl.module.css";
import { vtypeToString, stringToVtype } from "../../vtypes/utils";

import { ProgressBarComponent } from "../ProgressBar/progressBar";
import { writePv } from "../../hooks/useSubscription";
import { VType } from "../../vtypes/vtypes";
import { PVWidgetProps, PVWidget } from "../Widget/widget";

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

export const SlideControlComponent: React.FC<SlideControlProps> = (
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
    style = {},
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
    <div style={style}>
      <div
        style={{
          display: "block",
          position: "relative",
          height: "90%",
          width: "100%",
          top: "0%",
          left: "0%"
        }}
      >
        <ProgressBarComponent
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
          position: "relative",
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
          style={props.style}
        ></input>
      </div>
    </div>
  );
};

interface SlideControlWidgetProps {
  min: number;
  max: number;
  vertical?: boolean;
}

export const SlideControl = (
  props: SlideControlWidgetProps & PVWidgetProps
): JSX.Element => <PVWidget baseWidget={SlideControlComponent} {...props} />;
