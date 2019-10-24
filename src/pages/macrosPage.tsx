/* eslint no-template-curly-in-string: 0 */

import React from "react";

import { LabelWidget } from "../components/Label/label";
import { ConnectedReadbackWidget } from "../components/Readback/readback";
import { MacroUpdater } from "../components/MacroUpdater/macroUpdater";
import { MacroDisplayer } from "../components/MacroDisplayer/macroDisplayer";
import { ConnectedInputWidget } from "../components/Input/input";

export const MacrosPage = (): JSX.Element => (
  <div id="Central Column" style={{ width: "80%", margin: "auto" }}>
    <div style={{ display: "block" }}>
      <MacroUpdater />
      <MacroDisplayer />
    </div>
    <div style={{ display: "block" }}>
      <LabelWidget
        text="loc://pv${SUFFIX}"
        macroMap={{ SUFFIX1: "bba" }}
        containerStyling={{ position: "relative" }}
      />
      <ConnectedInputWidget
        pvName={"loc://pv1"}
        containerStyling={{ position: "relative" }}
      />
      <LabelWidget
        text="loc://pv2"
        containerStyling={{ position: "relative" }}
      />
      <ConnectedInputWidget
        pvName={"loc://pv2"}
        containerStyling={{ position: "relative" }}
      />
      <div style={{ height: "30px" }}>
        <ConnectedReadbackWidget
          pvName={"loc://pv${SUFFIX1}"}
          containerStyling={{ position: "relative" }}
          wrappers={{ copywrapper: true }}
        />
      </div>
      <div style={{ height: "30px" }}>
        <ConnectedReadbackWidget
          pvName={"loc://pv${SUFFIX2}"}
          containerStyling={{ position: "relative" }}
          wrappers={{ copywrapper: true }}
        />
      </div>
    </div>
  </div>
);
