// Component to provide basis of other EPICS widgets
// Should take pv name, value, alarm, timestamp
// These values will be displayed in a tooltip when highlighted
// A middle mouse click will copy the PV name to the clipboard

import React, { ReactNode, useState } from "react";
import { useId } from "react-id-generator";
import copyToClipboard from "clipboard-copy";
import Popover from "react-tiny-popover";

import { VType } from "../../../types/vtypes/vtypes";
import { useConnection } from "../../hooks/useConnection";
import classes from "./hookedTooltipWrapper.module.css";
import { resolveTooltip } from "../../widgets/tooltip";

export const HookedTooltipWrapper = (props: {
  pvName: string;
  connected: boolean;
  value?: VType;
  children: ReactNode;
  style?: object;
}): JSX.Element => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const { pvName, style = {} } = props;

  const activeClasses = ` ${classes.TooltipAvailable}`;

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

  if (popoverOpen) {
    const [id] = useId();
    // Ignoring effectivePvName as not used by readback
    const [effectivePvName, connected, readonly, latestValue] = useConnection(
      id,
      props.pvName
    );

    const tooltip = resolveTooltip({
      ...props,
      pvName: effectivePvName,
      connected: connected,
      readonly: readonly,
      value: latestValue
    });

    return (
      <div style={style}>
        <Popover
          isOpen={popoverOpen}
          position={["top"]}
          onClickOutside={(): void => setPopoverOpen(false)}
          content={(): JSX.Element => {
            return <div className={classes.Tooltip}>{tooltip}</div>;
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
        style={style}
      >
        {props.children}
      </div>
    );
  }
};
