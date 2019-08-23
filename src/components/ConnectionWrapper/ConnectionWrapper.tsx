import React from "react";
import { useSubscription } from "../../hooks/useCs";
import { useSelector } from "react-redux";
import { CsState } from "../../redux/csState";

export interface PvProps extends React.PropsWithChildren<any> {
  pvName: string;
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
    useSubscription(props.pvName);
    const latestValue = useSelector((state: CsState): string => {
      let pvState = state.valueCache[props.pvName];
      if (pvState == null || pvState.value == null) {
        return "";
      } else if (!pvState.connected) {
        return "Not connected";
      } else {
        return pvState.value.value.toString();
      }
    });
    return <Component {...(props as P)} value={latestValue}></Component>;
  };
};
