import React from "react";
import { Scalar, Alarm } from "../../ntypes";
import { connectionWrapper } from "../ConnectionWrapper/ConnectionWrapper";

import classes from "./readback.module.css";

export const Readback = (props: {
  value: Scalar;
  precision?: number;
  alarm?: Alarm;
  style?: {};
}): JSX.Element => {
  let {
    value,
    precision = undefined,
    alarm = { severity: 0, status: 0, message: "" },
    style = { backgroundColor: "#383838", color: "#00bb00" }
  } = props;
  let displayedValue;
  if (precision && precision >= 0) {
    if (typeof value === "string") {
      let numericalValue = parseFloat(value);
      if (isNaN(numericalValue)) {
        displayedValue = value;
      } else {
        displayedValue = numericalValue.toFixed(precision);
      }
    } else {
      displayedValue = value.toFixed(precision);
    }
  } else {
    if (value === "") {
      displayedValue = "Waiting for value";
    } else {
      displayedValue = value;
    }
  }

  // Change text depending on alarm color
  if (alarm.severity === 1) {
    // Minor alarm
    style = {
      ...style,
      color: "#eeee00"
    };
  } else if (alarm.severity === 2) {
    // Major alarm
    style = {
      ...style,
      color: "#ee0000"
    };
  }

  return (
    <div className={classes.Readback} style={style}>
      {displayedValue}
    </div>
  );
};

interface ConnectedReadbackProps {
  pvName: string;
  precision?: number;
  alarm?: Alarm;
  style?: {};
}

export const ConnectedReadback: React.FC<
  ConnectedReadbackProps
> = connectionWrapper(Readback);
