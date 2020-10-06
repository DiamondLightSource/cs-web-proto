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

/**
 * Creates a small led icon which can change color depending on connection
 * and alarm type, css file defines these colours
 * @param props properties to pass in, these will be handled by the below LED
 * function and only extra props defined on LedProps need to be passed in as well
 */
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
