import React from "react";
import { useId } from "react-id-generator";
import { useSubscription } from "../../hooks/useCs";
import { useSelector } from "react-redux";
import { CsState } from "../../redux/csState";
import { VType } from "../../vtypes/vtypes";

export interface PvProps extends React.PropsWithChildren<any> {
  pvName: string;
  shortPvName: string;
}

function pvStateSelector(
  pvName: string,
  state: CsState
): [string, boolean, boolean, VType?] {
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

/* See https://medium.com/@jrwebdev/react-higher-order-component-patterns-in-typescript-42278f7590fb
   for some notes on types.
   */
export const connectionWrapper = <P extends object>(
  Component: React.FC<P>
  // This next line should be React.FC<P & PvProps> but I can't pass TypeScript.
): React.FC<any> => {
  // eslint-disable-next-line react/display-name
  return (props: PvProps): JSX.Element => {
    const [id] = useId();
    useSubscription(id, props.pvName);
    const [shortPvName, connected, readonly, latestValue] = useSelector(
      (state: CsState): [string, boolean, boolean, VType?] => {
        return pvStateSelector(props.pvName, state);
      }
    );

    // ShortPvName and  initializingPvName are to deal with initializers
    // The short pvname is e.g. loc://hello as compared to loc://hello(1)
    // InitializingPvName is whatever pvName was used to initialize the pv, e.g. loc://hello(1)
    // pvName is the pvName specfied in the dom, which might either be a short name or an initializing name

    return (
      <Component
        {...(props as P)}
        shortPvName={shortPvName}
        connected={connected}
        readonly={readonly}
        value={latestValue}
      />
    );
  };
};
