// Component to allow setting of values using a slider.
// Displays value via an embedded progressbar widget

import React, { useState } from "react";
import PropTypes from "prop-types";

import classes from "./slideControl.module.css";
import { vtypeToString, stringToVtype } from "../../vtypes/utils";

import { ProgressBarComponent } from "../ProgressBar/progressBar";
import { writePv } from "../../hooks/useSubscription";
import {
  InferWidgetProps,
  PVInputComponent,
  PVWidget,
  PVWidgetPropType
} from "../Widget/widget";

const SlideControlProps = {
  min: PropTypes.number,
  max: PropTypes.number,
  vertical: PropTypes.bool,
  color: PropTypes.string,
  precision: PropTypes.number
};

export const SlideControlComponent = (
  props: InferWidgetProps<typeof SlideControlProps> & PVInputComponent
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
  ...SlideControlProps,
  ...PVWidgetPropType
};

export const SlideControl = (
  props: InferWidgetProps<typeof SlideControlWidgetProps>
): JSX.Element => <PVWidget baseWidget={SlideControlComponent} {...props} />;

SlideControl.propTypes = SlideControlWidgetProps;
