// Demos from the coniql server, if running.

import React from "react";

import { ConnectedStandaloneReadback } from "../components/Readback/readback";

export const ConiqlPage = (): JSX.Element => (
  <div id="Central Column" style={{ width: "80%", margin: "auto" }}>
    <h4>This page works only if the Coniql plugin is configured.</h4>
    <div style={{ height: "20px" }}>
      <ConnectedStandaloneReadback pvName={"sim://sine"} precision={3} />
      <ConnectedStandaloneReadback
        pvName={"sim://sine(-10, 10, 5, 1, 50, 80)"}
        precision={3}
      />
      <ConnectedStandaloneReadback
        pvName={"pva://TMC43-TS-IOC-01:CURRENT"}
        precision={3}
      />
      <ConnectedStandaloneReadback
        pvName={"pva://TMC43-TS-IOC-01:AI"}
        precision={3}
      />
    </div>
    <ConnectedStandaloneReadback pvName={"sim://sinewave"} precision={3} />
  </div>
);
