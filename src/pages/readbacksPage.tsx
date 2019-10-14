// Page with many readbacks

import React from "react";

import { ConnectedStandaloneReadback } from "../components/Readback/readback";

export const ReadbacksPage = (): JSX.Element => (
  <div id="Central Column" style={{ width: "80%", margin: "auto" }}>
    <h3>Readback: PV1</h3>
    <ConnectedStandaloneReadback pvName={"sim://limit#pv1"} style={{ color: "pink"}} />
    <h3>Readback: PV2</h3>
    <ConnectedStandaloneReadback pvName={"sim://limit#pv2"} />
    <h3>Readback: PV3</h3>
    <ConnectedStandaloneReadback pvName={"sim://limit#pv3"} />
    <h3>Readback: PV4</h3>
    <ConnectedStandaloneReadback pvName={"sim://limit#pv4"} />
  </div>
);
