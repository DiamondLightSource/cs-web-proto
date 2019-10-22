// Page with many inputs

import React from "react";

import {
  ConnectedInput,
  ConnectedStandaloneInput
} from "../components/Input/input";

export const InputsPage = (): JSX.Element => (
  <div
    id="Central Column"
    style={{ width: "80%", margin: "auto", position: "relative" }}
  >
    <h3>Input: PV1</h3>
    <ConnectedInput pvName={"sim://limit#pv1"} style={{ color: "red" }} />
    <h3>Input: PV2</h3>
    <ConnectedInput pvName={"sim://limit#pv2"} />
    <h3>Input: PV3</h3>
    <ConnectedInput pvName={"sim://limit#pv3"} />
    <h3>Input: PV4</h3>
    <ConnectedStandaloneInput pvName={"sim://limit#pv4"} />
  </div>
);
