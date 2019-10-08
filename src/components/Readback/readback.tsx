import React from "react";
import {
  NType,
  Alarm,
  NO_ALARM,
  ntToNumericString,
  ntToString
} from "../../ntypes";
import { connectionWrapper } from "../ConnectionWrapper/connectionWrapper";
import { CopyWrapper } from "../CopyWrapper/copyWrapper";
import { AlarmBorder } from "../AlarmBorder/alarmBorder";

import classes from "./readback.module.css";

export const Readback = (props: {
  connected: boolean;
  value?: NType;
  precision?: number;
  style?: {};
}): JSX.Element => {
  let {
    connected,
    value,
    precision = undefined,
    style = { backgroundColor: "#383838", color: "#00bb00" }
  } = props;
  let alarm = NO_ALARM;
  if (value && value.alarm != null) {
    alarm = value.alarm;
  }
  let displayedValue;
  if (!value) {
    displayedValue = "Waiting for value";
  } else if (precision && precision >= 0) {
    value = value as NType;
    displayedValue = ntToNumericString(value, precision);
  } else {
    displayedValue = ntToString(value);
  }

  // Change text color depending on connection state or alarm
  if (!connected) {
    style = {
      ...style,
      color: "#ffffff"
    };
  } else if (alarm.severity === 1) {
    // Minor alarm
    style = {
      ...style,
      color: "#eeee00"
    };
  } else if (alarm.severity === 2) {
    // Major alarm
    style = {
      ...style,
      color: "#ee0000"
    };
  }

  return (
    <div className={`Readback ${classes.Readback}`} style={style}>
      {displayedValue}
    </div>
  );
};

interface ConnectedReadbackProps {
  pvName: string;
  precision?: number;
  alarm?: Alarm;
  style?: {};
}

export const ConnectedReadback: React.FC<
  ConnectedReadbackProps
> = connectionWrapper(Readback);

interface ConnectedCopyReadbackProps {
  pvName: string;
  precision?: number;
  style?: {};
}

export const CopyReadback = (props: {
  pvName: string;
  value: NType;
  connected: boolean;
  precision?: number;
  style?: object;
}): JSX.Element => (
  <CopyWrapper
    pvName={props.pvName}
    connected={props.connected}
    value={props.value}
  >
    <Readback
      connected={props.connected}
      value={props.value}
      precision={props.precision}
    ></Readback>
  </CopyWrapper>
);

export const ConnectedCopyReadback: React.FC<
  ConnectedCopyReadbackProps
> = connectionWrapper(CopyReadback);

interface ConnectedStandaloneReadbackProps {
  pvName: string;
  precision?: number;
  style?: {};
}

export const StandaloneReadback = (props: {
  pvName: string;
  value: NType;
  connected: boolean;
  precision?: number;
  style?: object;
}): JSX.Element => (
  <CopyWrapper
    pvName={props.pvName}
    connected={props.connected}
    value={props.value}
  >
    <AlarmBorder connected={props.connected} value={props.value}>
      <Readback
        connected={props.connected}
        value={props.value}
        precision={props.precision}
      ></Readback>
    </AlarmBorder>
  </CopyWrapper>
);

export const ConnectedStandaloneReadback: React.FC<
  ConnectedStandaloneReadbackProps
> = connectionWrapper(StandaloneReadback);
