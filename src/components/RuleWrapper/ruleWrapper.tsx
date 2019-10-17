import React, { ReactNode, useState, ReactPropTypes } from "react";

import { VType } from "../../vtypes/vtypes";
import { __InputValue } from "graphql";
import { useId } from "react-id-generator";
import { useSubscription } from "../../hooks/useCs";
import { useSelector } from "react-redux";
import { CsState } from "../../redux/csState";

function pvStateSelector(pvName: string, state: CsState): [boolean, VType?] {
  const pvState = state.valueCache[pvName];
  let connected = false;
  let value = undefined;
  if (pvState != null) {
    connected = pvState.connected || false;
    value = pvState.value;
  }
  return [connected, value];
}

export const RuleWrapper = (props: {
  state?: any;
  prop: string;
  value?: VType;
  children: ReactNode;
  style?: object;
}): JSX.Element => {
  let comp: string = props.prop;
  const [id] = useId();
  let pv1 = "meta://pv1";
  useSubscription(id, pv1);
  const [connected, latestValue] = useSelector((state: CsState): [
    boolean,
    VType?
  ] => {
    return pvStateSelector(pv1, state);
  });
  if (props.value != undefined && latestValue != undefined) {
    let evaluatedValue = latestValue.getValue() - props.value.getValue();
    let styleValue = evaluatedValue < 50 ? "blue" : "red";
    let styleObj = { color: styleValue };
    return <div style={styleObj}>{props.children}</div>;
  } else {
    return <div>{props.children}</div>;
  }
};
