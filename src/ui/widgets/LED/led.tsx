import React from "react";
import { Widget } from "../widget";
import { InferWidgetProps, BoolPropOpt } from "../propTypes";
import { PVComponent, PVWidgetPropType } from "../widgetProps";
import { registerWidget } from "../register";
import classes from "./led.module.css";
import { DAlarm, DType, AlarmQuality } from "../../../types/dtypes";
import { LabelComponent } from "../Label/label";

export type CssAlarm = {
  [key: string]: string;
};

// TODO: Note this is a close duplicate of a function found in readback.tsx,
// this should be refactored into one common function
/**
 * Function to add CSS properties depending on the alarm severity
 * @param cls the default css properties for the widget that the alarm will add onto/modify
 * @param classes the css properties file for the widget
 * @param connected whether the widget is connected to the PV
 * @param alarmSeverity whether an alarm should register as minor or major
 */
export function getClass(
  cls: string,
  classes: CssAlarm,
  connected: boolean,
  alarmSeverity: AlarmQuality
): string {
  if (!connected) {
    cls += ` ${classes.Disconnected}`;
  } else {
    switch (alarmSeverity) {
      case AlarmQuality.WARNING: {
        cls += ` ${classes.Minor}`;
        break;
      }
      case AlarmQuality.ALARM: {
        cls += ` ${classes.Major}`;
        break;
      }
    }
  }
  return cls;
}

const LedProps = {
  // TODO: 06/10/20 Not sure if this is the correct prop type to use
  value: DType,
  connected: BoolPropOpt
};

export type LedComponentProps = InferWidgetProps<typeof LedProps> & PVComponent;

export const LedComponent = (props: LedComponentProps): JSX.Element => {
  const { value, connected } = props;

  const alarm = value?.getAlarm() || DAlarm.NONE;
  const className = getClass(classes.led, classes, connected, alarm.quality);

  return <LabelComponent text="" className={className} />;
};

const LedWidgetProps = {
  ...LedProps,
  ...PVWidgetPropType
};

export const LED = (
  props: InferWidgetProps<typeof LedWidgetProps>
): JSX.Element => <Widget baseWidget={LedComponent} {...props} />;

registerWidget(LED, PVWidgetPropType, "led");
