import React from "react";
import { connectionWrapper } from "../ConnectionWrapper/connectionWrapper";
import { CopyWrapper } from "../CopyWrapper/copyWrapper";
import { RuleWrapper } from "../RuleWrapper/ruleWrapper";
import { AlarmBorder } from "../AlarmBorder/alarmBorder";

import classes from "./readback.module.css";
import { macroWrapper } from "../MacroWrapper/macroWrapper";
import { VType } from "../../vtypes/vtypes";
import { Alarm, alarmOf, AlarmSeverity } from "../../vtypes/alarm";
import { vtypeToString } from "../../vtypes/utils";
import { MacroMap } from "../../redux/csState";

export interface ReadbackProps {
  connected: boolean;
  value?: VType;
  colour?: string;
  align?: string;
  precision?: number;
  style?: object;
  condition?: string;
  trueState?: string;
  falseState?: string;
  substitutionMap?: MacroMap;
  prop?: string;
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
  style = { ...style, color: props.colour, textAlign: props.align };
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

export const RuleReadback: React.FC<ReadbackProps> = RuleWrapper(Readback);

interface ConnectedReadbackProps {
  pvName: string;
  rawPvName?: string;
  precision?: number;
  alarm?: Alarm;
  style?: object;
}

export const ConnectedReadback: React.FC<
  ConnectedReadbackProps
> = connectionWrapper(RuleReadback);

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
  condition?: string;
  trueState?: string;
  falseState?: string;
  substitutionMap?: MacroMap;
  prop?: string;
}): JSX.Element => (
  <CopyWrapper
    pvName={props.pvName}
    rawPvName={props.rawPvName}
    connected={props.connected}
    value={props.value}
    style={props.style}
  >
    <RuleReadback
      connected={props.connected}
      value={props.value}
      precision={props.precision}
      style={props.style}
      prop={props.prop}
      condition={props.condition}
      trueState={props.trueState}
      falseState={props.falseState}
      substitutionMap={props.substitutionMap}
    ></RuleReadback>
  </CopyWrapper>
);

export const ConnectedCopyReadback: React.FC<
  ConnectedCopyReadbackProps
> = connectionWrapper(CopyReadback);

interface ConnectedStandaloneReadbackProps {
  pvName: string;
  precision?: number;
  condition?: string;
  trueState?: string;
  falseState?: string;
  substitutionMap?: MacroMap;
  prop?: string;
  style?: object;
}

export const StandaloneReadback = (props: {
  pvName: string;
  rawPvName?: string;
  value: VType;
  connected: boolean;
  precision?: number;
  style?: object;
  prop?: string;
  condition?: string;
  trueState?: string;
  falseState?: string;
  substitutionMap?: MacroMap;
  colour?: string;
}): JSX.Element => (
  <CopyWrapper
    pvName={props.pvName}
    rawPvName={props.rawPvName}
    connected={props.connected}
    value={props.value}
  >
    <AlarmBorder connected={props.connected} value={props.value}>
      <RuleReadback
        connected={props.connected}
        value={props.value}
        precision={props.precision}
        style={props.style}
        prop={props.prop}
        condition={props.condition}
        trueState={props.trueState}
        falseState={props.falseState}
        substitutionMap={props.substitutionMap}
      ></RuleReadback>
    </AlarmBorder>
  </CopyWrapper>
);

export const ConnectedStandaloneReadback: React.FC<
  ConnectedStandaloneReadbackProps
> = macroWrapper(connectionWrapper(StandaloneReadback));
