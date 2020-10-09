import React from "react";
import { Widget } from "../widget";
import {
  InferWidgetProps,
  StringPropOpt,
  FloatPropOpt,
  BoolPropOpt
} from "../propTypes";
import { PVComponent, PVWidgetPropType } from "../widgetProps";
import { registerWidget } from "../register";
import classes from "./led.module.css";
import { DAlarm } from "../../../types/dtypes";
import { getClass } from "../alarm";

/**
 * scale: a scaling factor for the led from it's default value
 * ruleRes: the resolved value of the user defined rule (if there is one)
 * useRule: whether to use the user defined rule instead of the PV alarm level
 */
export const LedProps = {
  scale: FloatPropOpt,
  ruleRes: StringPropOpt,
  useRule: BoolPropOpt
};

export type LedComponentProps = InferWidgetProps<typeof LedProps> & PVComponent;

/**
 * Creates a small led icon which can change color depending on connection
 * and alarm type, css file defines these colours
 * @param props properties to pass in, these will be handled by the below LED
 * function and only extra props defined on LedProps need to be passed in as well,
 * to define some text explaining the meaning of the LED in different colours add a
 * tooltip property in a json file containing a led
 */
export const LedComponent = (props: LedComponentProps): JSX.Element => {
  const { value, connected, useRule = false, ruleRes, scale = 1.0 } = props;

  // Alarm level, user defined rule takes precedent over PV alarm
  let alarm = DAlarm.NONE;
  if (useRule) {
    if (ruleRes === "major") {
      alarm = DAlarm.MAJOR;
    } else if (ruleRes === "minor") {
      alarm = DAlarm.MINOR;
    }
  } else {
    alarm = value?.getAlarm() || DAlarm.NONE;
  }
  const className = getClass(classes, connected, alarm.quality);

  const scaleTransform = {
    transform: `scale(${scale})`
  };

  return <div className={className} style={scaleTransform} />;
};

const LedWidgetProps = {
  ...LedProps,
  ...PVWidgetPropType
};

export const LED = (
  props: InferWidgetProps<typeof LedWidgetProps>
): JSX.Element => <Widget baseWidget={LedComponent} {...props} />;

registerWidget(LED, LedWidgetProps, "led");
