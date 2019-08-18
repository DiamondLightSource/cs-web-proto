import React from "react";
import { useSelector } from "react-redux";
import { useSubscription } from "../hooks/useCs";
import { NType } from "../cs";
import { CsState } from "../redux/store";

export const Readback = (props: {
  pvName: string;
  value: string;
}): JSX.Element => {
  let value = "";
  if (props.value !== null) {
    value = props.value;
  }
  return (
    <div>
      {props.pvName}: {value}
    </div>
  );
};

export const ConnectedReadback = (props: { pvName: string }): JSX.Element => {
  useSubscription(props.pvName);
  const latestValue = useSelector((state: CsState): string => {
    let value = state.valueCache[props.pvName];
    if (value == null) {
      return "";
    } else {
      return value.value.toString();
    }
  });
  return <Readback pvName={props.pvName} value={latestValue} />;
};
