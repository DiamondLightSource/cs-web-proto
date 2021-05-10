import React, { CSSProperties } from "react";
import { Widget } from "../widget";
import { InferWidgetProps, FloatPropOpt, ColorPropOpt } from "../propTypes";
import { PVComponent, PVWidgetPropType } from "../widgetProps";
import { registerWidget } from "../register";
import classes from "./led.module.css";

/**
 * width: the diameter of the LED
 */
export const LedProps = {
  width: FloatPropOpt,
  onColor: ColorPropOpt,
  offColor: ColorPropOpt
};

export type LedComponentProps = InferWidgetProps<typeof LedProps> & PVComponent;

/**
 * @param props properties to pass in, these will be handled by the below LED
 * function and only extra props defined on LedProps need to be passed in as well,
 * to define some text explaining the meaning of the LED in different colours add a
 * tooltip property in a json file containing a led
 */
export const LedComponent = (props: LedComponentProps): JSX.Element => {
  const { value, onColor, offColor, width } = props;

  const style: CSSProperties = {};

  style["backgroundColor"] = offColor?.toString();
  if (value !== undefined && value?.getDoubleValue() !== 0) {
    style["backgroundColor"] = onColor?.toString();
  }
  if (width) {
    // make sizes similar to size in CS-Studio, five taken
    // away from default in css file too
    style.width = `${width - 5}px`;
    style.height = `${width - 5}px`;
  }

  return <div className={classes.Led} style={style} />;
};

const LedWidgetProps = {
  ...LedProps,
  ...PVWidgetPropType
};

export const LED = (
  props: InferWidgetProps<typeof LedWidgetProps>
): JSX.Element => <Widget baseWidget={LedComponent} {...props} />;

registerWidget(LED, LedWidgetProps, "led");
