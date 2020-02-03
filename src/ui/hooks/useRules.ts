import log from "loglevel";

import { useSubscription } from "./useSubscription";
import { useSelector } from "react-redux";
import { MacroMap, CsState } from "../../redux/csState";

import { evaluate } from "mathjs";
import { PvArrayResults, pvStateSelector, pvStateComparator } from "./utils";
import { AnyProps } from "../widgets/widgetProps";

export interface Rule {
  condition: string;
  trueState: string | boolean;
  falseState: string | boolean;
  substitutionMap: MacroMap;
  prop: string;
}

export function useRules(props: AnyProps): AnyProps {
  const newProps: AnyProps = { ...props };
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
    let { condition } = rule;
    const { trueState, falseState, substitutionMap, prop } = rule;
    if (condition !== undefined && substitutionMap !== undefined) {
      pvs = Object.values(substitutionMap);
    }

    for (const [name, pv] of Object.entries(substitutionMap)) {
      const [pvState] = results[pv];
      if (pvState && pvState.value !== undefined && pvState.connected) {
        condition = condition.replace(name, pvState.value.getValue());
        try {
          const state = evaluate(condition);
          const updatedValue = state ? trueState : falseState;
          newProps[prop] = updatedValue;
        } catch (error) {
          log.warn(`Failed to evaluate rule ${condition}: ${error}`);
        }
      }
    }
  }
  return newProps;
}
