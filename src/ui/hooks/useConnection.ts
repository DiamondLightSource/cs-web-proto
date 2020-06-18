import React from "react";
import { useSubscription } from "./useSubscription";
import { useSelector } from "react-redux";
import { CsState } from "../../redux/csState";
import { pvStateSelector, PvArrayResults, pvStateComparator } from "./utils";
import { SubscriptionType } from "../../connection/plugin";
import { DType } from "../../types/dtypes";

export interface PvProps extends React.PropsWithChildren<any> {
  pvName: string;
  effectivePvName: string;
}

export function useConnection(
  id: string,
  pvName?: string,
  type?: SubscriptionType
): [string, boolean, boolean, DType?] {
  const pvNameArray = pvName === undefined ? [] : [pvName];
  const typeArray = type === undefined ? [] : [type];
  useSubscription(id, pvNameArray, typeArray);
  const pvResults = useSelector(
    (state: CsState): PvArrayResults => pvStateSelector(pvNameArray, state),
    pvStateComparator
  );
  let connected = false;
  let readonly = false;
  let value = undefined;
  let effectivePvName = "undefined";
  if (pvName !== undefined) {
    const [pvState, effPvName] = pvResults[pvName];
    effectivePvName = effPvName;
    if (pvState) {
      connected = pvState.connected || false;
      readonly = pvState.readonly || false;
      value = pvState.value;
    }
  }
  return [effectivePvName, connected, readonly, value];
}
