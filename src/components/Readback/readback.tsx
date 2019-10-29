import React from "react";

import classes from "./readback.module.css";
import { alarmOf, AlarmSeverity } from "../../vtypes/alarm";
import { vtypeToString } from "../../vtypes/utils";
import { PVWidgetProps, PVWidget } from "../Widget/widget";
import { PvState } from "../../redux/csState";

export interface ReadbackProps extends PvState {
  precision?: number;
  style?: object;
}

function getClass(alarmSeverity: any): string {
  switch (alarmSeverity) {
    case AlarmSeverity.MINOR: {
      return classes.Minor;
    }
    case AlarmSeverity.MAJOR: {
      return classes.Major;
    }
  }
  return classes.Readback;
}

export const ReadbackComponent = (props: ReadbackProps): JSX.Element => {
  let { connected, value, precision = undefined, style } = props;
  const alarm = alarmOf(value);
  let displayedValue;
  if (!value) {
    displayedValue = "Waiting for value";
  } else {
    displayedValue = vtypeToString(value, precision);
  }
  style = { backgroundColor: "#383838", ...props.style };

  // Change text color depending on connection state
  if (!connected) {
    style = {
      ...style,
      color: "#ffffff"
    };
  }

  return (
    <div
      className={`Readback ${classes.Readback} ${getClass(
        alarm.getSeverity()
      )}`}
      style={style}
    >
      {displayedValue}
    </div>
  );
};

interface ReadbackWidgetProps {
  precision?: number;
}

export const Readback = (
  props: ReadbackWidgetProps & PVWidgetProps
): JSX.Element => <PVWidget baseWidget={ReadbackComponent} {...props} />;
