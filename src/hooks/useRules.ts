import React, { ReactNode } from "react";

import { useSubscription } from "./useCs";
import { useSelector } from "react-redux";
import { MacroMap, CsState, PvState } from "../redux/csState";

import { evaluate } from "mathjs";

export interface RuleProps extends React.PropsWithChildren<any> {
  id: string;
  rule?: {
    condition: string;
    trueState: string;
    falseState: string;
    substitutionMap: MacroMap;
    prop: string;
  };
  children: ReactNode;
}

interface PvArrayResults {
  [pvName: string]: PvState;
}

function pvStateSelector(pvNames: string[], state: CsState): PvArrayResults {
  const results: PvArrayResults = {};
  for (const pvName of pvNames) {
    results[pvName] = state.valueCache[pvName];
  }
  return results;
}

export function useRules(props: RuleProps): RuleProps {
  const newProps: RuleProps = { ...props };
  let pvs: string[] =
    props.rule === undefined ? [] : Object.values(props.rule.substitutionMap);
  // Subscribe to all PVs.
  useSubscription(props.id, pvs);
  // Get results from all PVs.
  const results = useSelector(
    (state: CsState): PvArrayResults => pvStateSelector(pvs, state)
  );

  if (props.rule !== undefined) {
    console.log(props.rule);
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
      console.log(results);
      const pvState = results[pv];
      if (pvState && pvState.value !== undefined && pvState.connected) {
        condition = condition.replace(name, pvState.value.getValue());
        let state = evaluate(condition);
        console.log(`state is ${state}`);
        let styleValue = state ? trueState : falseState;
        newProps[prop] = styleValue;
      }
    }
  }
  return newProps;
}
