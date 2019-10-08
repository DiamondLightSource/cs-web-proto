import React, { ReactNode } from "react";
import { VType } from "../../vtypes/vtypes";
import { Alarm, alarmOf, AlarmSeverity } from "../../vtypes/alarm";

import classes from "./alarmBorder.module.css";

export const AlarmBorder = (props: {
  connected: boolean;
  value?: VType;
  children: ReactNode;
}): JSX.Element => {
  let { connected, value = null } = props;
  let alarm: Alarm = alarmOf(value);
  // Sort out alarm border classes
  let alarmClasses = [classes.Border, classes.Children];
  if (connected === false) {
    alarmClasses.push(classes.NotConnected);
  } else if (alarm.getSeverity() === AlarmSeverity.MINOR) {
    alarmClasses.push(classes.MinorAlarm);
  } else if (alarm.getSeverity() === AlarmSeverity.MAJOR) {
    alarmClasses.push(classes.MajorAlarm);
  }

  return <div className={alarmClasses.join(" ")}>{props.children}</div>;
};
