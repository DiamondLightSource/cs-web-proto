// Component to provide basis of other EPICS widgets
// Should take pv name, value, alarm, timestamp
// These values will be displayed in a tooltip when highlighted
// A middle mouse click will copy the PV name to the clipboard

import React, { ReactNode } from "react";
import { Time, Alarm } from "../../ntypes";
import copyToClipboard from "clipboard-copy";

import classes from "./CopyWrapper.module.css";

export const CopyWrapper = (props: {
  pvName: string;
  value: any;
  timestamp: Time;
  alarm?: Alarm;
  children: ReactNode;
  style?: object;
}) => {
  let {
    pvName,
    value,
    timestamp,
    alarm = { severity: 0, status: 0, message: "" },
    style = {}
  } = props;

  function copyPvToClipboard(e: React.MouseEvent) {
    if (e.button === 1) {
      copyToClipboard(pvName);
    }
  }
  // Compose the text which should be shown on the tooltip
  let toolTipText = [
    value.toString(),
    new Date(timestamp.secondsPastEpoch * 1000),
    alarm.message
  ]
    .filter(word => word !== "")
    .join(", ");

  return (
    <div
      className={classes.CopyWrapper}
      style={style}
      onClick={copyPvToClipboard}
    >
      <span className={classes.tooltiptext}>
        {pvName}
        <br />[{toolTipText}]
      </span>
      {props.children}
    </div>
  );
};
