import React from "react";
import log from "loglevel";

import { useSubscription } from "./useSubscription";
import { useSelector } from "react-redux";
import { MacroMap, CsState } from "../redux/csState";

import { evaluate } from "mathjs";
import { PvArrayResults, pvStateSelector, pvStateComparator } from "./utils";

export interface RuleProps extends React.PropsWithChildren<any> {
  id: string;
  rule?: {
    condition: string;
    trueState: string;
    falseState: string;
    substitutionMap: MacroMap;
    prop: string;
  };
}

export function useRules(props: RuleProps): RuleProps {
  const newProps: RuleProps = { ...props };
  let pvs: string[] =
    props.rule === undefined ? [] : Object.values(props.rule.substitutionMap);
  // Subscribe to all PVs.
  useSubscription(props.id, pvs);
  // Get results from all PVs.
  const results = useSelector(
    (state: CsState): PvArrayResults => pvStateSelector(pvs, state),
    pvStateComparator
  );

  if (props.rule !== undefined) {
    let {
      condition,
      trueState,
      falseState,
      substitutionMap,
      prop
    } = props.rule;
    if (condition !== undefined && substitutionMap !== undefined) {
      pvs = Object.values(substitutionMap);
    }

    for (let [name, pv] of Object.entries(substitutionMap)) {
      const [pvState] = results[pv];
      if (pvState && pvState.value !== undefined && pvState.connected) {
        condition = condition.replace(name, pvState.value.getValue());
        try {
          let state = evaluate(condition);
          let styleValue = state ? trueState : falseState;
          newProps[prop] = styleValue;
        } catch (error) {
          log.warn(`Failed to evaluate rule ${condition}: ${error}`);
        }
      }
    }
  }
  return newProps;
}
