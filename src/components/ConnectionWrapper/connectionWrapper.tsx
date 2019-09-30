import React from "react";
import { useId } from "react-id-generator";
import { useSubscription } from "../../hooks/useCs";
import { useSelector } from "react-redux";
import { CsState } from "../../redux/csState";
import { NType } from "../../ntypes";

export interface PvProps extends React.PropsWithChildren<any> {
  pvName: string;
}

function pvStateSelector(pvName: string, state: CsState): [boolean, NType?] {
  const pvState = state.valueCache[pvName];
  let connected = false;
  let value = undefined;
  if (pvState != null) {
    connected = pvState.connected || false;
    value = pvState.value;
  }
  return [connected, value];
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
    const [connected, latestValue] = useSelector((state: CsState): [
      boolean,

      NType?
    ] => {
      return pvStateSelector(props.pvName, state);
    });
    return (
      <Component
        {...(props as P)}
        connected={connected}
        value={latestValue}
      ></Component>
    );
  };
};
