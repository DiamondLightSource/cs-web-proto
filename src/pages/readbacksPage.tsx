// Page with many readbacks

import React from "react";

import { ConnectedStandaloneReadback } from "../components/Readback/readback";
import { ActionButton } from "../components/ActionButton/actionButton";
import { OPEN_WEBPAGE, WRITE_PV } from "../actions";

export const ReadbacksPage = (): JSX.Element => (
  <div id="Central Column" style={{ width: "80%", margin: "auto" }}>
    <h3>Readback: PV1</h3>
    <ConnectedStandaloneReadback
      pvName={"sim://limit#pv1"}
      style={{ color: "pink" }}
    />
    <h3>Readback: PV2</h3>
    <ConnectedStandaloneReadback pvName={"sim://limit#pv2"} />
    <h3>Readback: PV3</h3>
    <ConnectedStandaloneReadback pvName={"sim://limit#pv3"} />
    <h3>Readback: PV4</h3>
    <ConnectedStandaloneReadback pvName={"sim://limit#pv4"} />
    <ActionButton
      text={"hello"}
      actions={{
        actions: [
          {
            type: WRITE_PV,
            pvName: "sim://limit#pv1",
            value: 10
          },
          {
            type: OPEN_WEBPAGE,
            url: "https://www.bbc.co.uk",
            description: "BBC website"
          }
        ],
        executeAsOne: false
      }}
    />
  </div>
);
