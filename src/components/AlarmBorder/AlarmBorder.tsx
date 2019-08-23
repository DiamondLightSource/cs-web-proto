import React, { ReactNode } from "react";
import { Alarm } from "../../ntypes";

import classes from "./AlarmBorder.module.css";

export const AlarmBorder = (props: {
  alarm: Alarm;
  children: ReactNode;
}): JSX.Element => {
  // Sort out alarm border classes
  let alarmClasses = [classes.Border];
  if (props.alarm.severity === 1) {
    alarmClasses.push(classes.MinorAlarm);
  } else if (props.alarm.severity === 2) {
    alarmClasses.push(classes.MajorAlarm);
  }

  return (
    <div className={alarmClasses.join(" ")}>
      <div className={classes.Children}>{props.children}</div>
    </div>
  );
};
