// Page with many readbacks

import React from "react";

import { ConnectedStandaloneReadback } from "../components/Readback/readback";

export const RulesPage = (): JSX.Element => (
  <div id="Central Column" style={{ width: "80%", margin: "auto" }}>
    <h3>Readback: PV1</h3>
    <ConnectedStandaloneReadback pvName={"meta://pv1"} />
    <h3>Readback: PV2</h3>
    <ConnectedStandaloneReadback pvName={"sim://sine"} />
    <h3>Readback: PV3</h3>
    <ConnectedStandaloneReadback pvName={"meta://pv3"} />
  </div>
);
