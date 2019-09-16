// Front page of application

import React from "react";

import { Label } from "../components/Label/label";
import { ConnectedStandaloneReadback } from "../components/Readback/readback";
import { MacroUpdater } from "../components/MacroUpdater/MacroUpdater";
import { MacroDisplayer } from "../components/MacroDisplayer/MacroDisplayer";
import { ConnectedInput } from "../components/Input/input";

export const MacrosPage = (): JSX.Element => (
  <div id="Central Column" style={{ width: "80%", margin: "auto" }}>
    <div style={{ display: "block" }}>
      <MacroUpdater />
      <MacroDisplayer />
    </div>
    <div style={{ display: "block" }}>
      <Label text="loc://pv1"></Label>
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
