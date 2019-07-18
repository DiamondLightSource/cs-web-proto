import React from "react";
import { useSelector } from "react-redux";
import { useSubscription } from "../hooks/useCs";

export const Readback = (props: { pvName: string; value: any }) => (
  <div>
    {props.pvName}: {props.value}
  </div>
);

export const ConnectedReadback = (props: { pvName: string }): any => {
  useSubscription(props.pvName);
  const latestValue = useSelector(
    (state: any) => state.valueCache[props.pvName]
  );
  return <Readback pvName={props.pvName} value={latestValue} />;
};
