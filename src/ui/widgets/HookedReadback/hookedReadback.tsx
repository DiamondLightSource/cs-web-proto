import React from "react";
import { useId } from "react-id-generator";

import { PVComponent, PVWidgetPropType } from "../widget";
import { useConnection } from "../../hooks/useConnection";

// import classes from "./readback.module.css";
import { alarmOf, AlarmSeverity } from "../../../types/vtypes/alarm";
import { displayOf } from "../../../types/vtypes/display";
import { vtypeToString } from "../../../types/vtypes/utils";
import { IntPropOpt, BoolPropOpt, InferWidgetProps } from "../propTypes";
import { registerWidget } from "../register";

const ReadbackProps = {
  precision: IntPropOpt,
  showUnits: BoolPropOpt
};

// Needs to be exported for testing
export type ReadbackComponentProps = InferWidgetProps<typeof ReadbackProps> &
  PVComponent;

export const HookedReadbackComponent = (
  props: ReadbackComponentProps
): JSX.Element => {
  const { connected, value, precision, showUnits = false } = props;
  let { style } = props;
  // const alarm = alarmOf(value);
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
    color: "#2bff2f",
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

  return <div style={style}>{displayedValue}</div>;
};

const ReadbackWidgetProps = {
  ...ReadbackProps,
  ...PVWidgetPropType
};

export const HookedReadback = (
  props: InferWidgetProps<typeof ReadbackWidgetProps>
): JSX.Element => {
  const [id] = useId();
  const [effectivePvName, connected, readonly, latestValue] = useConnection(
    id,
    props.pvName
  );

  return (
    <HookedReadbackComponent
      value={latestValue}
      connected={connected}
      readonly={readonly}
      style={{ ...props.containerStyling, ...props.widgetStyling }}
    />
  );
};

registerWidget(HookedReadback, ReadbackWidgetProps, "hookedreadback");
