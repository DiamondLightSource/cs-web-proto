import React, { ReactNode } from "react";

import { VType } from "../../vtypes/vtypes";
import { useId } from "react-id-generator";
import { useSubscription } from "../../hooks/useCs";
import { useSelector } from "react-redux";
import { MacroMap, CsState } from "../../redux/csState";

export interface RuleProps extends React.PropsWithChildren<any> {
  expression?: string;
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
  let expression = props.expression;
  let valid = true;
  let styleValue;
  if (expression === undefined || props.substitutionMap === undefined)
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
        expression = expression.replace(name, latestValue.getValue());
      } else valid = false;
      console.log(expression);
    }
  }
  if (valid && expression !== undefined) {
    styleValue = eval(expression);
    let styleObj = { color: styleValue };
    return <div style={styleObj}>{props.children}</div>;
  } else {
    return <div>{props.children}</div>;
  }
};
