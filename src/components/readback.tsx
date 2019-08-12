import React from "react";
import { useSelector } from "react-redux";
import { useSubscription } from "../hooks/useCs";
import { NType } from "../cs";

export const Readback = (props: {
  pvName: string;
  value: NType;
}): JSX.Element => {
  let value = "";
  if (props.value) {
    value = props.value.value.toString();
  }
  return (
    <div>
      {props.pvName}: {value}
    </div>
  );
};

export const ConnectedReadback = (props: { pvName: string }): JSX.Element => {
  useSubscription(props.pvName);
  const latestValue = useSelector(
    (state: any): NType => {
      return state.valueCache[props.pvName];
    }
  );
  return <Readback pvName={props.pvName} value={latestValue} />;
};
