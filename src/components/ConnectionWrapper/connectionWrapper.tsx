import React from "react";
import { useId } from "react-id-generator";
import { useSubscription } from "../../hooks/useCs";
import { useSelector } from "react-redux";
import { CsState } from "../../redux/csState";
import { VType } from "../../vtypes/vtypes";

export interface PvProps extends React.PropsWithChildren<any> {
  pvName: string;
}

function pvStateSelector(
  pvName: string,
  state: CsState
): [boolean, boolean, VType?] {
  const pvState = state.valueCache[pvName];
  let connected = false;
  let readonly = false;
  let value = undefined;
  if (pvState != null) {
    connected = pvState.connected || false;
    readonly = pvState.readonly || false;
    value = pvState.value;
  }
  return [connected, readonly, value];
}

export function useConnection(pvName?: string): [boolean, boolean, VType?] {
  const [id] = useId();
  useSubscription(id, pvName);
  const [connected, readonly, latestValue] = useSelector((state: CsState): [
    boolean,
    boolean,
    VType?
  ] => {
    if (pvName) {
      return pvStateSelector(pvName, state);
    } else {
      return [false, false, undefined];
    }
  });
  return [connected, readonly, latestValue];
}
