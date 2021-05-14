// Component to allow setting of values using a slider.
// Displays value via an embedded progressbar widget

import React, { useState } from "react";
import log from "loglevel";

import classes from "./slideControl.module.css";

import {
  ProgressBarComponent,
  ProgressBarProps
} from "../ProgressBar/progressBar";
import { writePv } from "../../hooks/useSubscription";
import { Widget } from "../widget";
import { PVInputComponent, PVWidgetPropType } from "../widgetProps";
import { InferWidgetProps } from "../propTypes";
import { registerWidget } from "../register";
import { DType } from "../../../types/dtypes";

export const SlideControlComponent = (
  props: InferWidgetProps<typeof ProgressBarProps> & PVInputComponent
): JSX.Element => {
  const {
    pvName,
    connected,
    value,
    limitsFromPv = false,
    /* TODO: Implement vertical style and allow absolute positioning */
    //vertical = false,
    precision = undefined
  } = props;
  let { min = 0, max = 100 } = props;
  if (limitsFromPv && value?.display.controlRange) {
    min = value.display.controlRange?.min;
    max = value.display.controlRange?.max;
  }

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
    try {
      const doubleValue = parseFloat(event.currentTarget.value);
      writePv(pvName, new DType({ doubleValue: doubleValue }));
    } catch (error) {
      log.warn(`Unexpected value ${event.currentTarget.value} set to slider.`);
    }
  }

  const stringValue = DType.coerceString(value);
  if (!editing && inputValue !== stringValue) {
    setInputValue(stringValue);
  }

  return (
    <div>
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
          limitsFromPv={limitsFromPv}
          precision={precision}
          readonly={props.readonly}
          showLabel={true}
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
): JSX.Element => <Widget baseWidget={SlideControlComponent} {...props} />;

registerWidget(SlideControl, SlideControlWidgetProps, "slidecontrol");
