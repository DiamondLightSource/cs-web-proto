import React from "react";
import { Widget } from "../widget";
import { InferWidgetProps, StringPropOpt, FloatPropOpt } from "../propTypes";
import { PVComponent, PVWidgetPropType } from "../widgetProps";
import { registerWidget } from "../register";
import classes from "./led.module.css";
import { DAlarm, AlarmQuality } from "../../../types/dtypes";
import { Color } from "../../../types/color";

/**
 * scale: a scaling factor for the led from it's default value
 * ruleRes: the resolved value of the user defined rule (if there is one)
 * useRule: whether to use the user defined rule instead of the PV alarm level
 */
export const LedProps = {
  scale: FloatPropOpt,
  ruleRes: StringPropOpt,
  userColor: StringPropOpt
};

const alarmToColor = (alarm: DAlarm): Color => {
  const alarmQuality = alarm.quality;
  let ledColor = Color.GREEN;
  switch (alarmQuality) {
    case AlarmQuality.WARNING:
      ledColor = Color.YELLOW;
      break;
    case AlarmQuality.ALARM:
      ledColor = Color.RED;
      break;
  }
  return ledColor;
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
  const { value, connected, userColor, scale = 1.0 } = props;

  let backgroundColor;
  if (connected) {
    if ("rules" in props) {
      backgroundColor = Color.parse(userColor ? userColor : "green");
    } else {
      const alarm = value?.getAlarm() || DAlarm.NONE;
      backgroundColor = alarmToColor(alarm);
    }
  } else {
    backgroundColor = Color.GREY;
  }

  return (
    <div
      className={classes.led}
      style={{
        backgroundColor: backgroundColor.rgbaString(),
        transform: `scale(${scale})`
      }}
    />
  );
};

const LedWidgetProps = {
  ...LedProps,
  ...PVWidgetPropType
};

export const LED = (
  props: InferWidgetProps<typeof LedWidgetProps>
): JSX.Element => <Widget baseWidget={LedComponent} {...props} />;

registerWidget(LED, LedWidgetProps, "led");
