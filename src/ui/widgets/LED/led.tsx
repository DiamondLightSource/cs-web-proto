import React from "react";
import { Widget } from "../widget";
import { InferWidgetProps, StringPropOpt, FloatPropOpt } from "../propTypes";
import { PVComponent, PVWidgetPropType } from "../widgetProps";
import { registerWidget } from "../register";
import classes from "./led.module.css";
import { DAlarm } from "../../../types/dtypes";
import { Color } from "../../../types/color";

/**
 * scale: a scaling factor for the led from it's default value
 * userColor: the color associated with the resolved value of the user defined rule
 *  (if there is one)
 */
export const LedProps = {
  scale: FloatPropOpt,
  userColor: StringPropOpt
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
  const { value, userColor, scale = 1.0 } = props;

  const style: any = {
    transform: `scale(${scale})`
  };

  let allClasses = classes.Led;
  if ("rules" in props) {
    style.backgroundColor = Color.parse(
      userColor ? userColor : "#00ff00"
    ).rgbaString();
  } else {
    const alarm = value?.getAlarm() || DAlarm.NONE;
    allClasses += ` ${classes[alarm.quality]}`;
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
