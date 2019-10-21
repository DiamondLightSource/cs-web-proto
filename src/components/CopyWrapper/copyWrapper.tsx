// Component to provide basis of other EPICS widgets
// Should take pv name, value, alarm, timestamp
// These values will be displayed in a tooltip when highlighted
// A middle mouse click will copy the PV name to the clipboard

import React, { ReactNode, useState } from "react";
import copyToClipboard from "clipboard-copy";
import Popover from "react-tiny-popover";

import { connectionWrapper } from "../ConnectionWrapper/connectionWrapper";
import { VType } from "../../vtypes/vtypes";
import classes from "./copyWrapper.module.css";
import { vtypeToString } from "../../vtypes/utils";
import { timeOf } from "../../vtypes/time";
import { alarmOf } from "../../vtypes/alarm";

export const CopyWrapper = (props: {
  pvName: string;
  rawPvName?: string;
  connected: boolean;
  value?: VType;
  children: ReactNode;
  style?: object;
}): JSX.Element => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  let { connected, pvName, rawPvName = "", value = null, style = {} } = props;

  let displayValue = "";
  if (!connected) {
    displayValue = "WARNING: Not Connected";
  } else {
    if (!value) {
      displayValue = "Warning: Waiting for value";
    } else {
      displayValue = vtypeToString(value);
    }
  }

  const copyPvToClipboardOnMouse = (e: React.MouseEvent): void => {
    if (e.button === 1) {
      copyToClipboard(pvName);
    }
  };
  const copyPvToClipboardOnCopy = (e: React.ClipboardEvent): void => {
    copyToClipboard(pvName);
  };
  const showPopover = (e: React.MouseEvent): void => {
    if (e.button === 1) {
      setPopoverOpen(true);
    }
  };
  const hidePopover = (e: React.MouseEvent): void => {
    if (e.button === 1) {
      setPopoverOpen(false);
    }
  };
  // Compose the text which should be shown on the tooltip
  let time = timeOf(value);
  let alarm = alarmOf(value);
  let toolTipText = pvName === rawPvName ? pvName : `${pvName}\n(${rawPvName})`;
  let dateAndAlarm = [
    displayValue,
    value ? (time ? time.asDate() : "") : "",
    value ? (alarm ? alarm.getName() : "") : ""
  ]
    .filter((word): boolean => word !== "")
    .join(", ");
  toolTipText += `\n[${dateAndAlarm}]`;

  return (
    <div
      style={{ position: "relative", height: "100%", width: "100%", ...style }}
      onCopy={copyPvToClipboardOnCopy}
    >
      <Popover
        isOpen={popoverOpen}
        position={["top"]}
        onClickOutside={(): void => setPopoverOpen(false)}
        content={(): JSX.Element => {
          return <div className={classes.ToolTip}>{toolTipText}</div>;
        }}
      >
        <div
          onClick={copyPvToClipboardOnMouse}
          onMouseDown={showPopover}
          onMouseUp={hidePopover}
          className={classes.Children}
        >
          {props.children}
        </div>
      </Popover>
    </div>
  );
};

interface ConnectedCopyWrapperProps {
  pvName: string;
}

export const ConnectedCopyWrapper: React.FC<
  ConnectedCopyWrapperProps
> = connectionWrapper(CopyWrapper);
