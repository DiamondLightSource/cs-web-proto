// Page with many readbacks

import React from "react";

import { ConnectedStandaloneReadback } from "../components/Readback/readback";

export const ReadbacksPage = () => (
  <div id="Central Column" style={{ width: "80%", margin: "auto" }}>
    <h3>Input 1</h3>
    <div style={{ height: "20px" }}>
      <ConnectedStandaloneReadback pvName={"meta://pv1"} />
    </div>
    <h3>Input 2</h3>
    <div style={{ height: "20px" }}>
      <ConnectedStandaloneReadback pvName={"meta://pv2"} />
    </div>
    <h3>Input 3</h3>
    <div style={{ height: "20px" }}>
      <ConnectedStandaloneReadback pvName={"meta://pv3"} />
    </div>
    <h3>Input 4</h3>
    <div style={{ height: "20px" }}>
      <ConnectedStandaloneReadback pvName={"meta://pv4"} />
    </div>
  </div>
);
