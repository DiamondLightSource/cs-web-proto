import React from "react";
import { useSelector } from "react-redux";
import { useSubscription } from "../hooks/useCs";

export const Readback = (props: { pvName: string; value: any }) => (
  <div>
    {props.pvName}: {props.value}
  </div>
);

export const ConnectedReadback = (props: { pv: string }): any => {
  useSubscription(props.pv);
  const latestValue = useSelector((state: any) => state.valueCache[props.pv]);
  return <Readback pvName={props.pv} value={latestValue} />;
};
