// Component to provide basis of other EPICS widgets
// Should take pv name, value, alarm, timestamp
// These values will be displayed in a tooltip when highlighted
// A middle mouse click will copy the PV name to the clipboard

import React, { ReactNode } from "react";
import copyToClipboard from "clipboard-copy";

import { connectionWrapper } from "../ConnectionWrapper/connectionWrapper";
import { NType } from "../../ntypes";
import classes from "./copyWrapper.module.css";

export const CopyWrapper = (props: {
  pvName: string;
  connected: boolean;
  value?: NType;
  children: ReactNode;
  style?: object;
}): JSX.Element => {
  let { connected, pvName, value = null, style = {} } = props;

  let displayValue = "";
  if (!connected) {
    displayValue = "WARNING: Not Connected";
  } else {
    if (!value) {
      displayValue = "Warning: Waiting for value";
    } else {
      displayValue = value.value.toString();
    }
  }

  function copyPvToClipboard(e: React.MouseEvent): void {
    if (e.button === 1) {
      copyToClipboard(pvName);
    }
  }
  // Compose the text which should be shown on the tooltip
  let toolTipText = [
    displayValue,
    value
      ? value.time
        ? new Date(value.time.secondsPastEpoch * 1000)
        : ""
      : "",
    value ? (value.alarm ? value.alarm.message : "") : ""
  ]
    .filter((word): boolean => word !== "")
    .join(", ");

  return (
    <div
      className={classes.CopyWrapper}
      style={style}
      onClick={copyPvToClipboard}
    >
      <div className={classes.Children}>{props.children}</div>
      <span className={classes.tooltiptext}>
        {pvName}
        <br />[{toolTipText}]
      </span>
    </div>
  );
};

interface ConnectedCopyWrapperProps {
  pvName: string;
}

export const ConnectedCopyWrapper: React.FC<
  ConnectedCopyWrapperProps
> = connectionWrapper(CopyWrapper);
