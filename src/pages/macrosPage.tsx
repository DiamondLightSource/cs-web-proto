/* eslint no-template-curly-in-string: 0 */

import React from "react";

import { Label, MacroLabel } from "../components/Label/label";
import { ConnectedStandaloneReadback } from "../components/Readback/readback";
import { MacroUpdater } from "../components/MacroUpdater/macroUpdater";
import { MacroDisplayer } from "../components/MacroDisplayer/macroDisplayer";
import { ConnectedInput } from "../components/Input/input";

export const MacrosPage = (): JSX.Element => (
  <div id="Central Column" style={{ width: "80%", margin: "auto" }}>
    <div style={{ display: "block" }}>
      <MacroUpdater />
      <MacroDisplayer />
    </div>
    <div style={{ display: "block" }}>
      <Label text="loc://pv1"></Label>
      <MacroLabel
        text="loc://pv${SUFFIX}"
        macroMap={{ SUFFIX: "bbba" }}
      ></MacroLabel>
      <ConnectedInput pvName={"loc://pv1"} />
      <Label text="loc://pv2"></Label>
      <ConnectedInput pvName={"loc://pv2"} />
      <div style={{ height: "30px" }}>
        <ConnectedStandaloneReadback pvName={"loc://pv${SUFFIX1}"} />
      </div>
      <div style={{ height: "30px" }}>
        <ConnectedStandaloneReadback pvName={"loc://pv${SUFFIX2}"} />
      </div>
    </div>
  </div>
);
