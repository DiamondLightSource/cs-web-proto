import log from "loglevel";

import { useSubscription } from "./useSubscription";
import { useSelector } from "react-redux";
import { CsState } from "../../redux/csState";

import { PvArrayResults, pvStateSelector, pvStateComparator } from "./utils";
import { AnyProps } from "../widgets/widgetProps";
import { vtypeToString, vtypeToNumber } from "../../types/vtypes/utils";
import { AlarmSeverity } from "../../types/vtypes/alarm";
import { Scalar } from "../../types/vtypes/vtypes";

// See https://stackoverflow.com/questions/54542318/using-an-enum-as-a-dictionary-key
type EnumDictionary<T extends string | symbol | number, U> = {
  [K in T]: U;
};

const INT_SEVERITIES: EnumDictionary<AlarmSeverity, number> = {
  [AlarmSeverity.NONE]: 0,
  [AlarmSeverity.MINOR]: 1,
  [AlarmSeverity.MAJOR]: 2,
  [AlarmSeverity.INVALID]: -1,
  [AlarmSeverity.UNDEFINED]: -1
};

export function useRules(props: AnyProps): AnyProps {
  const newProps: AnyProps = { ...props };
  const rules = props.rules === undefined ? [] : props.rules;
  const allPvs: string[] = [];
  for (const rule of rules) {
    for (const pv of rule.pvs) {
      allPvs.push(pv.pvName.qualifiedName());
    }
  }
  // Subscribe to all PVs.
  useSubscription(props.id, allPvs);
  // Get results from all PVs.
  const results = useSelector(
    (state: CsState): PvArrayResults => pvStateSelector(allPvs, state),
    pvStateComparator
  );

  for (const rule of rules) {
    const { name, pvs, prop, outExp, expressions } = rule;
    const pvVars: { [pvName: string]: number | string } = {};
    for (let i = 0; i < pvs.length; i++) {
      // Set up variables that might be used.
      const pvResults = results[pvs[i].pvName.qualifiedName()][0];
      if (pvResults) {
        const val = results[pvs[i].pvName.qualifiedName()][0].value;
        if (val) {
          pvVars["pv" + i] = vtypeToNumber(val);
          pvVars["pvStr" + i] = vtypeToString(val);
          pvVars["pvInt" + i] = vtypeToNumber(val);
          if (val instanceof Scalar) {
            pvVars["pvSev" + i] = INT_SEVERITIES[val.getAlarm().getSeverity()];
          }
        }
      }
    }

    try {
      for (const exp of expressions) {
        log.debug(`Evaluating expression ${exp.boolExp}`);
        log.debug(`Keys ${Object.keys(pvVars)}`);
        log.debug(`Values ${Object.values(pvVars)}`);
        // eslint-disable-next-line no-new-func
        const f = Function(...Object.keys(pvVars), "return " + exp.boolExp);
        // Evaluate the expression.
        const result = f(...Object.values(pvVars));
        log.debug(`result ${result}`);
        if (result) {
          // Not 'output expression': set the prop to the provided value.
          log.debug("Expression matched");
          if (!outExp) {
            newProps[prop] = exp.convertedValue;
            log.debug("Output value");
            log.debug(newProps);
          } else {
            // 'Output expression' - evaluate 'value' and set the prop to the result.
            // eslint-disable-next-line no-new-func
            const f = Function(...Object.keys(pvVars), "return " + exp.value);
            newProps[prop] = f(...Object.values(pvVars));
            log.debug("Output expression");
          }
          log.debug("Props after rule evaluation:");
          log.debug(newProps);
          break;
        } else {
          log.debug("Expression did not match");
        }
      }
    } catch (error) {
      log.warn(`Failed to evaluate rule ${name}: ${error}`);
    }
  }
  return newProps;
}
