import React, { ReactNode } from "react";
import { Alarm, NType } from "../../ntypes";

import classes from "./alarmBorder.module.css";

export const AlarmBorder = (props: {
  connected: boolean;
  value?: NType;
  children: ReactNode;
}): JSX.Element => {
  let { connected, value = null } = props;
  let alarm: Alarm = { severity: 0, status: 0, message: "" };
  if (value && value.alarm) {
    alarm = value.alarm;
  }
  // Sort out alarm border classes
  let alarmClasses = [classes.Border];
  if (connected === false) {
    alarmClasses.push(classes.NotConnected);
  } else if (alarm.severity === 1) {
    alarmClasses.push(classes.MinorAlarm);
  } else if (alarm.severity === 2) {
    alarmClasses.push(classes.MajorAlarm);
  }

  return (
    <div className={alarmClasses.join(" ")}>
      <div className={classes.Children}>{props.children}</div>
    </div>
  );
};
