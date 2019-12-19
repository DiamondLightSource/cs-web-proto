// Component to allow setting of values using a slider.
// Displays value via an embedded progressbar widget

import React, { useState } from "react";

import classes from "./slideControl.module.css";
import { vtypeToString, stringToVtype } from "../../../types/vtypes/utils";

import {
  ProgressBarComponent,
  ProgressBarProps
} from "../ProgressBar/progressBar";
import { writePv } from "../../hooks/useSubscription";
import { PVInputComponent, PVWidget, PVWidgetPropType } from "../widget";
import { InferWidgetProps } from "../propTypes";
import { registerWidget } from "../register";

export const SlideControlComponent = (
  props: InferWidgetProps<typeof ProgressBarProps> & PVInputComponent
): JSX.Element => {
  const {
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

  const stringValue = vtypeToString(value);
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
          readonly={props.readonly}
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

const SlideControlWidgetProps = {
  ...ProgressBarProps,
  ...PVWidgetPropType
};

export const SlideControl = (
  props: InferWidgetProps<typeof SlideControlWidgetProps>
): JSX.Element => <PVWidget baseWidget={SlideControlComponent} {...props} />;

registerWidget(SlideControl, SlideControlWidgetProps, "slidecontrol");
