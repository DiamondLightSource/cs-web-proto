import log from "loglevel";

import { useSubscription } from "./useSubscription";
import { useSelector } from "react-redux";
import { CsState } from "../../redux/csState";

import { PvArrayResults, pvStateSelector, pvStateComparator } from "./utils";
import { AnyProps } from "../widgets/widgetProps";
import { AlarmQuality, DType } from "../../types/dtypes";
import { SubscriptionType } from "../../connection/plugin";
import { Border, BorderStyle } from "../../types/border";
import { Color } from "../../types/color";

// See https://stackoverflow.com/questions/54542318/using-an-enum-as-a-dictionary-key
type EnumDictionary<T extends string | symbol | number, U> = {
  [K in T]: U;
};

const INT_SEVERITIES: EnumDictionary<AlarmQuality, number> = {
  [AlarmQuality.VALID]: 0,
  [AlarmQuality.ALARM]: 1, // Curious alarm/warning numbering
  [AlarmQuality.WARNING]: 2, // as in CS-Studio
  [AlarmQuality.INVALID]: -1,
  [AlarmQuality.UNDEFINED]: -1,
  [AlarmQuality.CHANGING]: -1
};

export function useRules(props: AnyProps): AnyProps {
  const newProps: AnyProps = { ...props };
  const rules = props.rules === undefined ? [] : props.rules;
  const allPvs: string[] = [];
  const allTypes: SubscriptionType[] = [];
  let pvNotConnected = false;
  for (const rule of rules) {
    for (const pv of rule.pvs) {
      allPvs.push(pv.pvName.qualifiedName());
      allTypes.push({ string: true, double: true });
    }
  }
  // Subscribe to all PVs.
  useSubscription(props.id, allPvs, allTypes);
  // Get results from all PVs.
  const results = useSelector(
    (state: CsState): PvArrayResults => pvStateSelector(allPvs, state),
    pvStateComparator
  );

  for (const rule of rules) {
    const { name, pvs, prop, outExp, expressions } = rule;
    const pvVars: { [pvName: string]: number | string | undefined } = {};
    for (let i = 0; i < pvs.length; i++) {
      // Set up variables that might be used.
      const pvState = results[pvs[i].pvName.qualifiedName()][0];
      if (!pvState?.connected) {
        log.debug(`Rule ${name}: pv ${pvs[i].pvName} not connected`);
        pvNotConnected = true;
      }
      const val = pvState?.value;
      let value = undefined;
      let doubleValue = undefined;
      let intValue = undefined;
      let stringValue = undefined;
      let severity = undefined;
      if (val) {
        doubleValue = val.getDoubleValue();
        intValue =
          doubleValue === undefined ? undefined : Math.round(doubleValue);
        stringValue = DType.coerceString(val);
        value = doubleValue ?? stringValue;
        severity = INT_SEVERITIES[val.getAlarm()?.quality || 0];
      }

      pvVars["pv" + i] = value;
      pvVars["pvStr" + i] = stringValue;
      pvVars["pvInt" + i] = intValue;
      pvVars["pvSev" + i] = severity;
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
            const expression = "return " + (exp.convertedValue ?? exp.value);
            log.debug(`Output expression ${expression}`);
            // eslint-disable-next-line no-new-func
            const f = Function(...Object.keys(pvVars), expression);
            newProps[prop] = f(...Object.values(pvVars));
          }
          log.debug("Props after rule evaluation:");
          log.debug(newProps);
          break;
        } else {
          log.debug("Expression did not match");
        }
      }
      // If any PV does not connect, add a disconnected border.
      if (pvNotConnected) {
        newProps.border = new Border(BorderStyle.Dotted, Color.DISCONNECTED, 3);
      }
    } catch (error) {
      log.warn(`Failed to evaluate rule ${name}: ${error}`);
    }
  }
  return newProps;
}
