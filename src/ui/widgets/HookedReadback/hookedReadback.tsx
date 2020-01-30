import React from "react";
import { useId } from "react-id-generator";

import { PVComponent, PVWidgetPropType } from "../widget";
import { useConnection } from "../../hooks/useConnection";

// import classes from "./readback.module.css";
import classes from "./hookedreadback.module.css";
import { alarmOf, AlarmSeverity } from "../../../types/vtypes/alarm";
import { displayOf } from "../../../types/vtypes/display";
import { vtypeToString } from "../../../types/vtypes/utils";
import { IntPropOpt, BoolPropOpt, InferWidgetProps } from "../propTypes";
import { registerWidget } from "../register";

const ReadbackProps = {
  precision: IntPropOpt,
  showUnits: BoolPropOpt
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
  return classes.HookedReadback;
}

// Needs to be exported for testing
export type ReadbackComponentProps = InferWidgetProps<typeof ReadbackProps> &
  PVComponent;

export const HookedReadbackComponent = (
  props: ReadbackComponentProps
): JSX.Element => {
  const { connected, value, precision, showUnits = false } = props;
  let { style } = props;
  const alarm = alarmOf(value);
  const display = displayOf(value);
  let displayedValue;
  if (!value) {
    displayedValue = "Waiting for value";
  } else {
    displayedValue = vtypeToString(value, precision);
  }
  const { x = null, y = null } = { ...props.style };
  style = {
    left: x,
    top: y,
    backgroundColor: "#383838",
    ...props.style
  };

  // Add units if there are any and show units is true
  if (showUnits === true && display.getUnit() !== "") {
    displayedValue = displayedValue + ` ${display.getUnit()}`;
  }

  // Change text color depending on connection state
  if (!connected) {
    style = {
      ...style,
      color: "#ffffff"
    };
  }

  const className = `Readback ${classes.HookedReadback} ${getClass(
    alarm.getSeverity()
  )}`;

  return (
    <div className={className} style={style}>
      {displayedValue}
    </div>
  );
};

const ReadbackWidgetProps = {
  ...ReadbackProps,
  ...PVWidgetPropType
};

export const HookedReadback = (
  props: InferWidgetProps<typeof ReadbackWidgetProps>
): JSX.Element => {
  const [id] = useId();
  // Ignoring effectivePvName as not used by readback
  const [, connected, readonly, latestValue] = useConnection(id, props.pvName);

  const style = { ...props.containerStyling, ...props.widgetStyling };

  return (
    <HookedReadbackComponent
      value={latestValue}
      connected={connected}
      readonly={readonly}
      style={style}
    />
  );
};

registerWidget(HookedReadback, ReadbackWidgetProps, "hookedreadback");
