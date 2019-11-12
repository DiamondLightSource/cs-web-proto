import React from "react";
import { useSubscription } from "./useSubscription";
import { useSelector } from "react-redux";
import { CsState } from "../redux/csState";
import { VType } from "../vtypes/vtypes";

export interface PvProps extends React.PropsWithChildren<any> {
  pvName: string;
  shortPvName: string;
}

type PvState = [string, boolean, boolean, VType?];

export function pvStateSelector(pvName: string, state: CsState): PvState {
  let shortPvName = state.shortPvNameMap[pvName] || pvName;
  const pvState = state.valueCache[shortPvName];
  let connected = false;
  let readonly = false;
  let value = undefined;
  if (pvState != null) {
    connected = pvState.connected || false;
    readonly = pvState.readonly || false;
    value = pvState.value;
  }
  return [shortPvName, connected, readonly, value];
}

export function pvStateComparator(
  beforeState: PvState,
  afterState: PvState
): boolean {
  for (let i = 0; i < 4; i++) {
    if (beforeState[i] !== afterState[i]) {
      return false;
    }
  }
  return true;
}

export function useConnection(
  id: string,
  pvName: string
): [string, boolean, boolean, VType?] {
  useSubscription(id, [pvName]);
  const [shortPvName, connected, readonly, latestValue] = useSelector(
    (state: CsState): [string, boolean, boolean, VType?] => {
      if (pvName) {
        return pvStateSelector(pvName, state);
      } else {
        return ["", false, false, undefined];
      }
    },
    pvStateComparator
  );
  return [shortPvName, connected, readonly, latestValue];
}
