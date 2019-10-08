// Page with many readbacks

import React from "react";

import { ConnectedStandaloneReadback } from "../components/Readback/readback";

export const ReadbacksPage = (): JSX.Element => (
  <div id="Central Column" style={{ width: "80%", margin: "auto" }}>
    <h3>Readback: PV1</h3>
    <div style={{ height: "20px" }}>
      <ConnectedStandaloneReadback pvName={"meta://pv1"} style={{color: 'pink'}}/>
    </div>
    <h3>Readback: PV2</h3>
    <div style={{ height: "20px" }}>
      <ConnectedStandaloneReadback pvName={"meta://pv2"} />
    </div>
    <h3>Readback: PV3</h3>
    <div style={{ height: "20px" }}>
      <ConnectedStandaloneReadback pvName={"meta://pv3"} />
    </div>
    <h3>Readback: PV4</h3>
    <div style={{ height: "20px" }}>
      <ConnectedStandaloneReadback pvName={"meta://pv4"} />
    </div>
  </div>
);
