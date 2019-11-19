import React from "react";
import { useSubscription } from "./useSubscription";
import { useSelector } from "react-redux";
import { CsState } from "../redux/csState";
import { VType } from "../vtypes/vtypes";
import { pvStateSelector, PvArrayResults, pvStateComparator } from "./utils";

export interface PvProps extends React.PropsWithChildren<any> {
  pvName: string;
  effectivePvName: string;
}

export function useConnection(
  id: string,
  pvName: string
): [string, boolean, boolean, VType?] {
  useSubscription(id, [pvName]);
  const pvResults = useSelector(
    (state: CsState): PvArrayResults => pvStateSelector([pvName], state),
    pvStateComparator
  );
  const [pvState, effectivePvName] = pvResults[pvName];
  if (pvState) {
    const connected = pvState.connected || false;
    const readonly = pvState.readonly || false;
    return [effectivePvName, connected, readonly, pvState.value];
  } else {
    return [effectivePvName, false, false, undefined];
  }
}
