import React from "react";
import { Widget } from "../widget";
import {
  InferWidgetProps,
  StringPropOpt,
  FloatPropOpt,
  BoolProp
} from "../propTypes";
import { PVComponent, PVWidgetPropType } from "../widgetProps";
import { registerWidget } from "../register";
import classes from "./led.module.css";
import { DAlarm } from "../../../types/dtypes";

/**
 * width: the diameter of the LED
 * userColor: the color associated with the resolved value of the user defined rule
 *  (if there is one)
 */
export const LedProps = {
  width: FloatPropOpt,
  userColor: StringPropOpt,
  alarmSensitive: BoolProp
};

export type LedComponentProps = InferWidgetProps<typeof LedProps> & PVComponent;

/**
 * Creates a small led icon which can change color depending on alarm type,
 * css file defines these colours
 * @param props properties to pass in, these will be handled by the below LED
 * function and only extra props defined on LedProps need to be passed in as well,
 * to define some text explaining the meaning of the LED in different colours add a
 * tooltip property in a json file containing a led
 */
export const LedComponent = (props: LedComponentProps): JSX.Element => {
  const { value, userColor, alarmSensitive, width } = props;

  const style: any = {};

  if (width) {
    // make sizes similar to size in CS-Studio, five taken
    // away from default in css file too
    style.width = `${width - 5}px`;
    style.height = `${width - 5}px`;
  }

  let allClasses = classes.Led;
  // User defined rules take precedent over alarmSensitity
  if ("rules" in props) {
    style.backgroundColor = userColor ? userColor : "#00ff00";
  } else {
    if (alarmSensitive) {
      const alarm = value?.getAlarm() || DAlarm.NONE;
      const css = classes[alarm.quality];
      if (css) {
        allClasses += ` ${css}`;
      }
    }
  }

  return <div className={allClasses} style={style} />;
};

const LedWidgetProps = {
  ...LedProps,
  ...PVWidgetPropType
};

export const LED = (
  props: InferWidgetProps<typeof LedWidgetProps>
): JSX.Element => <Widget baseWidget={LedComponent} {...props} />;

registerWidget(LED, LedWidgetProps, "led");
