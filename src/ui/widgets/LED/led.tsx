import React from "react";
import { Widget } from "../widget";
import { InferWidgetProps } from "../propTypes";
import { PVComponent, PVWidgetPropType } from "../widgetProps";
import { registerWidget } from "../register";
import classes from "./led.module.css";
import { DAlarm } from "../../../types/dtypes";
import { LabelComponent } from "../Label/label";
import { getClass } from "../alarm";

// No current props but left for easy addition later
const LedProps = {};

export type LedComponentProps = InferWidgetProps<typeof LedProps> & PVComponent;

export const LedComponent = (props: LedComponentProps): JSX.Element => {
  const { value, connected } = props;

  const alarm = value?.getAlarm() || DAlarm.NONE;
  const className = getClass(classes, connected, alarm.quality);

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
