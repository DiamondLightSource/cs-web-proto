// Page with many readbacks

import React from "react";
import { MacroMap } from "../redux/csState";

import { ConnectedStandaloneReadback } from "../components/Readback/readback";

let substitutionMap: MacroMap = {};
substitutionMap["pv1"] = "sim://sine";
substitutionMap["pv2"] = "meta://pv3";

export const RulesPage = (): JSX.Element => (
  <div id="Central Column" style={{ width: "80%", margin: "auto" }}>
    <h3>Readback: PV1</h3>
    <ConnectedStandaloneReadback
      pvName={"meta://pv1"}
      expression='pv2+pv1<50?"blue":"red"'
      substitutionMap={substitutionMap}
    />
    <h3>Readback: PV2</h3>
    <ConnectedStandaloneReadback pvName={"sim://sine"} />
    <h3>Readback: PV3</h3>
    <ConnectedStandaloneReadback pvName={"meta://pv3"} />
  </div>
);
