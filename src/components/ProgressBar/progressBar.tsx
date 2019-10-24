import React from "react";

import { VType } from "../../vtypes/vtypes";
import classes from "./progressBar.module.css";

import { vtypeOrUndefinedToNumber } from "../../vtypes/utils";
import { PVWidget, PVWidgetInterface } from "../Widget/widget";

interface ProgressBarProps {
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

export const ProgressBarComponent: React.FC<ProgressBarProps> = (
  props: ProgressBarProps
): JSX.Element => {
  let {
    value,
    min = 0,
    max = 100,
    vertical = false,
    color = "#00aa00",
    precision = undefined
  } = props;

  // eslint-disable-next-line no-undef
  let numValue = vtypeOrUndefinedToNumber(value);
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
      height: `${onPercent}%`,
      ...props.style
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
    <div className={classes.bar} style={{ ...props.style }}>
      <div className={classes.off} style={offStyle} />
      <div className={classes.on} style={onStyle} />
      <div className={classes.label}>{valueText.toString()}</div>
    </div>
  );
};

interface ProgressBarWidgetProps {
  min: number;
  max: number;
  vertical?: boolean;
  color?: string;
  precision?: number;
  style?: object;
}

export const ProgressBar = (
  props: ProgressBarWidgetProps & PVWidgetInterface
): JSX.Element => <PVWidget baseWidget={ProgressBarComponent} {...props} />;
