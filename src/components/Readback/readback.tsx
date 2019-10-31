import React from "react";
import PropTypes from "prop-types";

import classes from "./readback.module.css";
import { alarmOf, AlarmSeverity } from "../../vtypes/alarm";
import { vtypeToString } from "../../vtypes/utils";
import { PVComponent, PVWidget, PVWidgetPropType } from "../Widget/widget";

const ReadbackProps = {
  precision: PropTypes.number
};

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

export const ReadbackComponent = (
  props: PropTypes.InferProps<typeof ReadbackProps> & PVComponent
): JSX.Element => {
  let { connected, value, precision, style } = props;
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

const ReadbackWidgetProps = {
  ...ReadbackProps,
  ...PVWidgetPropType
};

export const Readback = (
  props: PropTypes.InferProps<typeof ReadbackWidgetProps>
): JSX.Element => <PVWidget baseWidget={ReadbackComponent} {...props} />;

Readback.propTypes = ReadbackWidgetProps;
