import React from "react";
import { useSelector } from "react-redux";
import { useSubscription } from "../../hooks/useCs";
import { CsState } from "../../redux/csState";
import { Scalar, Alarm } from "../../ntypes";

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

export const ConnectedReadback = (props: {
  pvName: string;
  precision?: number;
}): JSX.Element => {
  useSubscription(props.pvName);
  const latestValue = useSelector((state: CsState): string => {
    let pvState = state.valueCache[props.pvName];
    if (pvState == null || pvState.value == null) {
      return "";
    } else if (!pvState.connected) {
      return "Not connected";
    } else {
      return pvState.value.value.toString();
    }
  });
  return <Readback {...props} value={latestValue} />;
};
