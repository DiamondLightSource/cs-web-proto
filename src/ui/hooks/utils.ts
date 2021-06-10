import { PvState, CsState } from "../../redux/csState";
import { DType } from "../../types/dtypes";

export interface PvArrayResults {
  [pvName: string]: [PvState, string];
}

export function pvStateSelector(
  pvNames: string[],
  state: CsState
): PvArrayResults {
  const results: PvArrayResults = {};
  for (const pvName of pvNames) {
    const effectivePvName = state.effectivePvNameMap[pvName] || pvName;
    results[pvName] = [state.valueCache[effectivePvName], effectivePvName];
  }
  return results;
}

export function deviceSelector(device: string, state: CsState): DType {
  return state.deviceCache[device];
}

export function deviceComparator(before: DType, after: DType): boolean {
  if (!before || !after) {
    return false;
  }
  if (Object.keys(before).length !== Object.keys(after).length) {
    return false;
  }
  if (before.value.stringValue !== after.value.stringValue) {
    return false;
  }
  return true;
}

/* Used for preventing re-rendering if the results are equivalent.
   Note that if the state for a particular PV hasn't changed, we will
   get back the same object as last time so we are safe to compare them.
   We need to be careful that we don't have a situation where we get back
   the same object with different properties and compare it as equal when
   in fact it has changed.
*/
export function pvStateComparator(
  before: PvArrayResults,
  after: PvArrayResults
): boolean {
  if (Object.keys(before).length !== Object.keys(after).length) {
    return false;
  }
  for (const [pvName, [beforeVal, beforeEffPvName]] of Object.entries(before)) {
    // If the PV name for a widget has changed the previous results may
    // not resemble the new results at all.
    if (!after.hasOwnProperty(pvName)) {
      return false;
    }
    const [afterVal, afterEffPvName] = after[pvName];
    // If the PV state hasn't changed in the store, we will receive the same
    // object when selecting that PV state.
    if (beforeVal !== afterVal || beforeEffPvName !== afterEffPvName) {
      return false;
    }
  }
  return true;
}
