// Component to provide basis of other EPICS widgets
// Should take pv name, value, alarm, timestamp
// These values will be displayed in a tooltip when highlighted
// A middle mouse click will copy the PV name to the clipboard

import React, { ReactNode, useState } from "react";
import copyToClipboard from "clipboard-copy";
import Popover from "react-tiny-popover";

import { VType } from "../../vtypes/vtypes";
import classes from "./tooltipWrapper.module.css";

export const TooltipWrapper = (props: {
  pvName: string;
  rawPvName?: string;
  connected: boolean;
  value?: VType;
  children: ReactNode;
  style?: object;
  resolvedTooltip?: string;
}): JSX.Element => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  let { pvName, style = {} } = props;

  let activeClasses = "";
  if (props.resolvedTooltip) {
    activeClasses += ` ${classes.TooltipAvailable}`;
  }

  const mouseDown = (e: React.MouseEvent): void => {
    if (e.button === 1) {
      setPopoverOpen(true);
      if (pvName) {
        e.currentTarget.classList.add(classes.Copying);
        copyToClipboard(pvName);
      }
    }
  };
  const mouseUp = (e: React.MouseEvent): void => {
    if (e.button === 1) {
      setPopoverOpen(false);
      e.currentTarget.classList.remove(classes.Copying);
    }
  };

  if (props.resolvedTooltip) {
    return (
      <div style={{ height: "100%", width: "100%", ...style }}>
        <Popover
          isOpen={popoverOpen}
          position={["top"]}
          onClickOutside={(): void => setPopoverOpen(false)}
          content={(): JSX.Element => {
            return (
              <div className={classes.Tooltip}>{props.resolvedTooltip}</div>
            );
          }}
        >
          <div
            onMouseDown={mouseDown}
            onMouseUp={mouseUp}
            className={activeClasses}
            style={{ height: "100%", width: "100%" }}
          >
            {props.children}
          </div>
        </Popover>
      </div>
    );
  } else {
    return (
      <div
        onMouseDown={mouseDown}
        onMouseUp={mouseUp}
        className={activeClasses}
        style={{ height: "100%", width: "100%", ...style }}
      >
        {props.children}
      </div>
    );
  }
};
