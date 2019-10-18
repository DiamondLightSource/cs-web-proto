import React, { ReactNode } from "react";

import { VType } from "../../vtypes/vtypes";
import { useId } from "react-id-generator";
import { useSubscription } from "../../hooks/useCs";
import { useSelector } from "react-redux";
import { MacroMap, CsState } from "../../redux/csState";

import { evaluate } from "mathjs";

export interface RuleProps extends React.PropsWithChildren<any> {
  condition?: string;
  trueState?: string;
  falseState?: string;
  substitutionMap?: MacroMap;
  prop?: string;
  children: ReactNode;
}

function pvStateSelector(pvName: string, state: CsState): [boolean, VType?] {
  const pvState = state.valueCache[pvName];
  let connected = false;
  let value = undefined;
  if (pvState != null) {
    connected = pvState.connected || false;
    value = pvState.value;
  }
  return [connected, value];
}

export const RuleWrapper = (props: RuleProps): JSX.Element => {
  let condition = props.condition;
  let valid = true;
  if (condition === undefined || props.substitutionMap === undefined)
    valid = false;
  else {
    for (let [name, pv] of Object.entries(props.substitutionMap)) {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [id] = useId();
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useSubscription(id, pv);
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [connected, latestValue] = useSelector((state: CsState): [
        boolean,
        VType?
      ] => {
        return pvStateSelector(pv, state);
      });
      if (latestValue !== undefined && connected) {
        condition = condition.replace(name, latestValue.getValue());
      } else valid = false;
      console.log(condition);
    }
  }
  if (valid && condition !== undefined) {
    let state = evaluate(condition);
    let styleValue = state ? props.trueState : props.falseState;
    let styleObj = { color: styleValue }; //should use 'prop' not hard-coded color
    return <div style={styleObj}>{props.children}</div>;
  } else {
    return <div>{props.children}</div>;
  }
};
