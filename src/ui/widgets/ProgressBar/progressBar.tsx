import React from "react";

import classes from "./progressBar.module.css";
import { Widget } from "../widget";
import { PVComponent, PVWidgetPropType } from "../widgetProps";
import { registerWidget } from "../register";
import {
  FloatPropOpt,
  BoolPropOpt,
  StringPropOpt,
  IntPropOpt,
  InferWidgetProps,
  FontPropOpt
} from "../propTypes";

export const ProgressBarProps = {
  min: FloatPropOpt,
  max: FloatPropOpt,
  limitsFromPv: BoolPropOpt,
  vertical: BoolPropOpt,
  color: StringPropOpt,
  precision: IntPropOpt,
  font: FontPropOpt
};

export const ProgressBarComponent = (
  props: InferWidgetProps<typeof ProgressBarProps> & PVComponent
): JSX.Element => {
  const {
    value,
    limitsFromPv = false,
    font,
    vertical = false,
    color = "#00aa00",
    precision = undefined
  } = props;
  let { min = 0, max = 100 } = props;

  if (limitsFromPv && value?.display.controlRange) {
    min = value.display.controlRange?.min;
    max = value.display.controlRange?.max;
  }

  const numValue = value?.getDoubleValue() || 0;
  const onPercent =
    numValue < min
      ? 0
      : numValue > max
      ? 100
      : ((numValue - min) / (max - min)) * 100.0;
  // Store styles in these variables
  // Change the direction of the gradient depending on wehether the bar is vertical
  const direction = vertical === true ? "to left" : "to top";
  let onStyle = {};
  const offStyle = {};
  const barColor = {
    backgroundImage: `linear-gradient(${direction}, ${color} 50%, #ffffff 130%)`
  };
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
  const valueText =
    min > max
      ? "Check min and max values"
      : precision
      ? numValue.toFixed(precision)
      : numValue.toString();

  return (
    <div className={classes.bar}>
      <div className={classes.off} style={offStyle} />
      <div className={classes.on} style={onStyle} />
      <div className={classes.label} style={{ ...font?.css() }}>
        {valueText.toString()}
      </div>
    </div>
  );
};

const ProgressBarWidgetProps = {
  ...ProgressBarProps,
  ...PVWidgetPropType
};

export const ProgressBar = (
  props: InferWidgetProps<typeof ProgressBarWidgetProps>
): JSX.Element => <Widget baseWidget={ProgressBarComponent} {...props} />;

registerWidget(ProgressBar, ProgressBarWidgetProps, "progressbar");
