import React from "react";

import { NType, ntOrNullToNumber } from "../../ntypes";
import classes from "./ProgressBar.module.css";
import { connectionWrapper } from "../ConnectionWrapper/ConnectionWrapper";

interface ProgressBarProps {
  connected: boolean;
  value?: NType;
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

// Same as ProgressBarProps but without connected and value as these are
// collected from the store
interface ConnectedProgressBarProps {
  pvName: string;
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

export const ProgressBar: React.FC<ProgressBarProps> = (
  props: ProgressBarProps
): JSX.Element => {
  let {
    value,
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

  let barStyle = {
    top: top,
    left: left,
    height: height,
    width: width
  };
  let numValue = ntOrNullToNumber(value);
  let onPercent =
    numValue < min
      ? 0
      : numValue > max
      ? 100
      : ((numValue - min) / (max - min)) * 100.0;
  // Store styles in these variables
  // Change the direction of the gradient depending on wehether the bar is vertical
  let direction = vertical === true ? "to left" : "to top";
  let barColor = {
      backgroundImage: `linear-gradient(${direction}, ${color} 50%, #ffffff 130%)`
    },
    onStyle = {},
    offStyle = {};
  if (vertical === true) {
    onStyle = {
      ...barColor,
      width: "100%",
      height: `${onPercent}%`
    };
  } else {
    onStyle = {
      ...barColor,
      height: "100%",
      width: `${onPercent}%`
    };
  }

  // Show a warning if min is bigger than max and apply precision if provided
  let valueText =
    min > max
      ? "Check min and max values"
      : precision
      ? numValue.toFixed(precision)
      : numValue.toString();

  return (
    <div style={barStyle}>
      <div className={classes.off} style={offStyle} />
      <div className={classes.on} style={onStyle} />
      <div className={classes.label} style={fontStyle}>
        {valueText}
      </div>
    </div>
  );
};

export const ConnectedProgressBar: React.FC<
  ConnectedProgressBarProps
> = connectionWrapper(ProgressBar);
