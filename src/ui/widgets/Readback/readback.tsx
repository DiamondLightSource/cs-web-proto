import React from "react";

import { Widget } from "../widget";
import { PVComponent, PVWidgetPropType } from "../widgetProps";

import classes from "./readback.module.css";
import {
  IntPropOpt,
  BoolPropOpt,
  InferWidgetProps,
  ChoicePropOpt,
  FontPropOpt,
  ColorPropOpt,
  BorderPropOpt,
  StringPropOpt,
  FloatPropOpt
} from "../propTypes";
import { registerWidget } from "../register";
import { LabelComponent } from "../Label/label";
import { AlarmQuality, DAlarm, DType } from "../../../types/dtypes";
import { Color } from "../../../types/color";

const ReadbackProps = {
  precision: IntPropOpt,
  formatType: ChoicePropOpt(["default", "decimal", "exponential"]),
  showUnits: BoolPropOpt,
  precisionFromPv: BoolPropOpt,
  alarmSensitive: BoolPropOpt,
  text: StringPropOpt,
  textAlign: ChoicePropOpt(["left", "center", "right"]),
  transparent: BoolPropOpt,
  font: FontPropOpt,
  foregroundColor: ColorPropOpt,
  backgroundColor: ColorPropOpt,
  border: BorderPropOpt,
  rotationAngle: FloatPropOpt,
  visible: BoolPropOpt
};

// Needs to be exported for testing
export type ReadbackComponentProps = InferWidgetProps<typeof ReadbackProps> &
  PVComponent;

export const ReadbackComponent = (
  props: ReadbackComponentProps
): JSX.Element => {
  const {
    value,
    precision,
    formatType = "default",
    font,
    backgroundColor,
    border,
    alarmSensitive = true,
    transparent = false,
    text = "######",
    textAlign = "center",
    showUnits = false,
    precisionFromPv = false,
    rotationAngle,
    visible
  } = props;
  let { foregroundColor } = props;
  // Decide what to display.
  const alarm = value?.getAlarm() || DAlarm.NONE;
  const display = value?.getDisplay();
  const prec = precisionFromPv ? display?.precision ?? precision : precision;
  let displayedValue;
  if (!value) {
    displayedValue = text;
  } else {
    if (value.display.choices) {
      // Enum PV so use string representation.
      displayedValue = DType.coerceString(value);
    } else if (prec !== undefined && !isNaN(DType.coerceDouble(value))) {
      if (formatType === "exponential") {
        displayedValue = DType.coerceDouble(value).toExponential(prec);
      } else {
        displayedValue = DType.coerceDouble(value).toFixed(prec);
      }
    } else {
      displayedValue = DType.coerceString(value);
    }
  }

  // Add units if there are any and show units is true.
  if (showUnits && display?.units) {
    displayedValue = displayedValue + ` ${display.units}`;
  }

  // Handle alarm sensitivity.
  let className = classes.Readback;
  if (alarmSensitive) {
    className += ` ${classes[alarm.quality]}`;
  }
  if (alarmSensitive) {
    switch (alarm.quality) {
      case AlarmQuality.UNDEFINED:
      case AlarmQuality.INVALID:
      case AlarmQuality.CHANGING:
        foregroundColor = new Color("var(--invalid)");
        break;
      case AlarmQuality.WARNING:
        foregroundColor = new Color("var(--warning)");
        break;
      case AlarmQuality.ALARM:
        foregroundColor = new Color("var(--alarm)");
        break;
    }
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
      rotationAngle={rotationAngle}
      visible={visible}
    ></LabelComponent>
  );
};

const ReadbackWidgetProps = {
  ...ReadbackProps,
  ...PVWidgetPropType
};

export const Readback = (
  props: InferWidgetProps<typeof ReadbackWidgetProps>
): JSX.Element => (
  <Widget
    // TODO: Note that we asking for both string and double here;
    // this subverts the intended efficiency.
    pvType={{ string: true, double: true }}
    baseWidget={ReadbackComponent}
    {...props}
  />
);

registerWidget(Readback, ReadbackWidgetProps, "readback");
