// Page with many inputs

import React from "react";

import { ConnectedInput } from "../components/Input/input";

export const InputsPage = (): JSX.Element => (
  <div id="Central Column" style={{ width: "80%", margin: "auto" }}>
    <h3>Input: PV1</h3>
    <ConnectedInput pvName={"meta://pv1"} />
    <h3>Input: PV2</h3>
    <ConnectedInput pvName={"meta://pv2"} />
    <h3>Input: PV3</h3>
    <ConnectedInput pvName={"meta://pv3"} />
    <h3>Input: PV4</h3>
    <ConnectedInput pvName={"meta://pv4"} />
  </div>
);
