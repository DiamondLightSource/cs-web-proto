import React from "react";

import { Widget } from "../widget";
import { PVComponent, PVWidgetPropType } from "../widgetProps";

import classes from "./readback.module.css";
import { alarmOf, AlarmSeverity } from "../../../types/vtypes/alarm";
import { displayOf } from "../../../types/vtypes/display";
import { vtypeToString } from "../../../types/vtypes/utils";
import {
  IntPropOpt,
  BoolPropOpt,
  InferWidgetProps,
  ChoicePropOpt,
  FontPropOpt,
  ColorPropOpt,
  BorderPropOpt
} from "../propTypes";
import { registerWidget } from "../register";
import { LabelComponent } from "../Label/label";

const ReadbackProps = {
  precision: IntPropOpt,
  showUnits: BoolPropOpt,
  fgAlarmSensitive: BoolPropOpt,
  textAlign: ChoicePropOpt(["left", "center", "right"]),
  transparent: BoolPropOpt,
  font: FontPropOpt,
  foregroundColor: ColorPropOpt,
  backgroundColor: ColorPropOpt,
  border: BorderPropOpt
};

// Needs to be exported for testing
export type ReadbackComponentProps = InferWidgetProps<typeof ReadbackProps> &
  PVComponent;

function getClass(connected: boolean, alarmSeverity: AlarmSeverity): string {
  let cls = classes.Readback;
  if (!connected) {
    cls += ` ${classes.Disconnected}`;
  } else {
    switch (alarmSeverity) {
      case AlarmSeverity.MINOR: {
        cls += ` ${classes.Minor}`;
        break;
      }
      case AlarmSeverity.MAJOR: {
        cls += ` ${classes.Major}`;
        break;
      }
    }
  }
  return cls;
}

export const ReadbackComponent = (
  props: ReadbackComponentProps
): JSX.Element => {
  const {
    connected,
    value,
    precision,
    font,
    foregroundColor,
    backgroundColor,
    border,
    fgAlarmSensitive = false,
    transparent = false,
    textAlign = "center",
    showUnits = false
  } = props;
  // Decide what to display.
  const alarm = alarmOf(value);
  const display = displayOf(value);
  let displayedValue;
  if (!value) {
    displayedValue = "Waiting for value";
  } else {
    displayedValue = vtypeToString(value, precision);
  }

  // Add units if there are any and show units is true
  if (showUnits && display && display?.getUnit) {
    displayedValue = displayedValue + ` ${display.getUnit()}`;
  }

  // Handle foreground alarm sensitivity.
  let className = classes.Readback;
  if (fgAlarmSensitive) {
    className = getClass(connected, alarm.getSeverity());
  }

  // Use a LabelComponent to display it.
  return (
    <LabelComponent
      className={className}
      text={displayedValue}
      transparent={transparent}
      textAlign={textAlign}
      font={font}
      foregroundColor={foregroundColor}
      backgroundColor={backgroundColor}
      border={border}
    ></LabelComponent>
  );
};

const ReadbackWidgetProps = {
  ...ReadbackProps,
  ...PVWidgetPropType
};

export const Readback = (
  props: InferWidgetProps<typeof ReadbackWidgetProps>
): JSX.Element => <Widget baseWidget={ReadbackComponent} {...props} />;

registerWidget(Readback, ReadbackWidgetProps, "readback");
