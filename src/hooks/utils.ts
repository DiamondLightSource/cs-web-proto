import { PvState, CsState } from "../redux/csState";

export interface PvArrayResults {
  [pvName: string]: [PvState, string];
}

export function pvStateSelector(
  pvNames: string[],
  state: CsState
): PvArrayResults {
  const results: PvArrayResults = {};
  for (const pvName of pvNames) {
    results[pvName] = [
      state.valueCache[pvName],
      state.shortPvNameMap[pvName] || pvName
    ];
  }
  return results;
}

/* Used for preventing re-rendering if the results are equivalent. */
export function pvStateComparator(
  before: PvArrayResults,
  after: PvArrayResults
): boolean {
  if (Object.keys(before).length !== Object.keys(after).length) {
    return false;
  }
  for (const [pvName, [beforeVal, beforeShortPvName]] of Object.entries(
    before
  )) {
    const [afterVal, afterShortPvName] = after[pvName];
    // If the PV state hasn't changed in the store, we will receive the same
    // object when selecting that PV state.
    if (beforeVal !== afterVal || beforeShortPvName !== afterShortPvName) {
      return false;
    }
  }
  return true;
}
