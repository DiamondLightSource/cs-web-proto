import React from "react";
import { useSelector } from "react-redux";
import { useSubscription } from "../../hooks/useCs";
import { CsState } from "../../redux/store";
import { Base } from "../Base/Base";

export const Readback = (props: {
  pvName: string;
  value: string;
}): JSX.Element => {
  let value = "";
  if (props.value !== null) {
    value = props.value;
  }
  return (
    <Base
      pvName={props.pvName}
      value={props.value}
      timestamp={new Date().toLocaleString()}
    >
      <div>
        {props.pvName}: {value}
      </div>
    </Base>
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
  return <Readback {...props} value={latestValue} />;
};
