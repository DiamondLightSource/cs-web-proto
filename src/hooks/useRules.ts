import React from "react";
import log from "loglevel";

import { useSubscription } from "./useSubscription";
import { useSelector } from "react-redux";
import { MacroMap, CsState } from "../redux/csState";

import { evaluate } from "mathjs";
import { PvArrayResults, pvStateSelector, pvStateComparator } from "./utils";

export interface Rule {
  condition: string;
  trueState: string | boolean;
  falseState: string | boolean;
  substitutionMap: MacroMap;
  prop: string;
}

export interface RuleProps extends React.PropsWithChildren<any> {
  id: string;
  rules?: Rule[];
}

export function useRules(props: RuleProps): RuleProps {
  const newProps: RuleProps = { ...props };
  const rules = props.rules === undefined ? [] : props.rules;
  let pvs: string[] = [];
  for (const rule of rules) {
    pvs.push(...Object.values(rule.substitutionMap));
  }
  // Subscribe to all PVs.
  useSubscription(props.id, pvs);
  // Get results from all PVs.
  const results = useSelector(
    (state: CsState): PvArrayResults => pvStateSelector(pvs, state),
    pvStateComparator
  );

  for (const rule of rules) {
    let { condition, trueState, falseState, substitutionMap, prop } = rule;
    if (condition !== undefined && substitutionMap !== undefined) {
      pvs = Object.values(substitutionMap);
    }

    for (const [name, pv] of Object.entries(substitutionMap)) {
      const [pvState] = results[pv];
      if (pvState && pvState.value !== undefined && pvState.connected) {
        condition = condition.replace(name, pvState.value.getValue());
        try {
          const state = evaluate(condition);
          const styleValue = state ? trueState : falseState;
          newProps[prop] = styleValue;
        } catch (error) {
          log.warn(`Failed to evaluate rule ${condition}: ${error}`);
        }
      }
    }
  }
  return newProps;
}
