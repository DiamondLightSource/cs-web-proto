import React from "react";
import { connectionWrapper } from "../ConnectionWrapper/connectionWrapper";
import { CopyWrapper } from "../CopyWrapper/copyWrapper";
import { AlarmBorder } from "../AlarmBorder/alarmBorder";

import classes from "./readback.module.css";
import { macroWrapper } from "../MacroWrapper/macroWrapper";
import { VType } from "../../vtypes/vtypes";
import { Alarm, alarmOf, AlarmSeverity } from "../../vtypes/alarm";
import { vtypeToString } from "../../vtypes/utils";
import {
  Widget,
  PVWidgetInterface,
  ConnectedWidgetInterface
} from "../Widget/widget";

export interface ReadbackProps {
  connected: boolean;
  value?: VType;
  precision?: number;
  style?: object;
}

function getClass(alarmSeverity: any): string {
  switch (alarmSeverity) {
    case AlarmSeverity.MINOR: {
      return classes.Minor;
    }
    case AlarmSeverity.MAJOR: {
      return classes.Major;
    }
  }
  return classes.Readback;
}

export const Readback = (props: ReadbackProps): JSX.Element => {
  let { connected, value, precision = undefined, style } = props;
  const alarm = alarmOf(value);
  let displayedValue;
  if (!value) {
    displayedValue = "Waiting for value";
  } else {
    displayedValue = vtypeToString(value, precision);
  }
  style = { backgroundColor: "#383838", ...props.style };

  // Change text color depending on connection state
  if (!connected) {
    style = {
      ...style,
      color: "#ffffff"
    };
  }

  return (
    <div
      className={`Readback ${classes.Readback} ${getClass(
        alarm.getSeverity()
      )}`}
      style={style}
    >
      {displayedValue}
    </div>
  );
};

interface ConnectedReadbackProps {
  pvName: string;
  rawPvName?: string;
  precision?: number;
  alarm?: Alarm;
  style?: object;
}

export const ConnectedReadback: React.FC<
  ConnectedReadbackProps
> = connectionWrapper(Readback);

interface ConnectedCopyReadbackProps {
  pvName: string;
  rawPvName?: string;
  precision?: number;
  style?: object;
}

export const CopyReadback = (props: {
  pvName: string;
  rawPvName?: string;
  value: VType;
  connected: boolean;
  precision?: number;
  style?: object;
}): JSX.Element => (
  <CopyWrapper
    pvName={props.pvName}
    rawPvName={props.rawPvName}
    connected={props.connected}
    value={props.value}
    style={props.style}
  >
    <Readback
      connected={props.connected}
      value={props.value}
      precision={props.precision}
      style={props.style}
    ></Readback>
  </CopyWrapper>
);

export const ConnectedCopyReadback: React.FC<
  ConnectedCopyReadbackProps
> = connectionWrapper(CopyReadback);

interface ConnectedStandaloneReadbackProps {
  pvName: string;
  precision?: number;
  style?: object;
}

export const StandaloneReadback = (props: {
  pvName: string;
  rawPvName?: string;
  value: VType;
  connected: boolean;
  precision?: number;
  style?: object;
}): JSX.Element => (
  <CopyWrapper
    pvName={props.pvName}
    rawPvName={props.rawPvName}
    connected={props.connected}
    value={props.value}
  >
    <AlarmBorder connected={props.connected} value={props.value}>
      <Readback
        connected={props.connected}
        value={props.value}
        precision={props.precision}
        style={props.style}
      ></Readback>
    </AlarmBorder>
  </CopyWrapper>
);

export const ConnectedStandaloneReadback: React.FC<
  ConnectedStandaloneReadbackProps
> = macroWrapper(connectionWrapper(StandaloneReadback));

interface ReadbackWidgetProps {
  precision?: number;
}

export const ReadbackWidget = (
  props: ReadbackWidgetProps & PVWidgetInterface
): JSX.Element => {
  return <Widget baseWidget={Readback} {...props} />;
};

export const ConnectedReadbackWidget: React.FC<
  ReadbackWidgetProps & ConnectedWidgetInterface
> = macroWrapper(connectionWrapper(ReadbackWidget));
