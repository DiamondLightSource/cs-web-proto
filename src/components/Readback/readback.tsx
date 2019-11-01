import React from "react";
import PropTypes from "prop-types";

import {
  InferWidgetProps,
  PVComponent,
  PVWidget,
  PVWidgetPropType
} from "../../components/Widget/widget";

import classes from "./readback.module.css";
import { alarmOf, AlarmSeverity } from "../../vtypes/alarm";
import { vtypeToString } from "../../vtypes/utils";

const ReadbackProps = {
  precision: PropTypes.number
};
export type ReadbackComponentProps = InferWidgetProps<typeof ReadbackProps> &
  PVComponent;

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
  props: InferWidgetProps<typeof ReadbackProps> & PVComponent
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
  props: InferWidgetProps<typeof ReadbackWidgetProps>
): JSX.Element => <PVWidget baseWidget={ReadbackComponent} {...props} />;

Readback.propTypes = ReadbackWidgetProps;
