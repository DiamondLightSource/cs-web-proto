/* eslint no-template-curly-in-string: 0 */

import React from "react";

import { Label } from "../components/Label/label";
import { Readback } from "../components/Readback/readback";
import { MacroUpdater } from "../components/MacroUpdater/macroUpdater";
import { MacroDisplayer } from "../components/MacroDisplayer/macroDisplayer";
import { Input } from "../components/Input/input";

export const MacrosPage = (): JSX.Element => (
  <div id="Central Column" style={{ width: "80%", margin: "auto" }}>
    <div style={{ display: "block" }}>
      <MacroUpdater />
      <MacroDisplayer />
    </div>
    <div style={{ display: "block" }}>
      <Label
        text="loc://pv${SUFFIX}"
        macroMap={{ SUFFIX1: "bba" }}
        containerStyling={{
          position: "relative",
          height: "",
          width: "",
          margin: "",
          padding: "",
          border: ""
        }}
      />
      <Input
        pvName={"loc://pv1"}
        containerStyling={{
          position: "relative",
          height: "",
          width: "",
          margin: "",
          padding: "",
          border: ""
        }}
      />
      <Label
        text="loc://pv2"
        containerStyling={{
          position: "relative",
          height: "",
          width: "",
          margin: "",
          padding: "",
          border: ""
        }}
      />
      <Input
        pvName={"loc://pv2"}
        containerStyling={{
          position: "relative",
          height: "",
          width: "",
          margin: "",
          padding: "",
          border: ""
        }}
      />
      <div style={{ height: "30px" }}>
        <Readback
          pvName={"loc://pv${SUFFIX1}"}
          containerStyling={{
            position: "relative",
            height: "",
            width: "",
            margin: "",
            padding: "",
            border: ""
          }}
        />
      </div>
      <div style={{ height: "30px" }}>
        <Readback
          pvName={"loc://pv${SUFFIX2}"}
          containerStyling={{
            position: "relative",
            height: "",
            width: "",
            margin: "",
            padding: "",
            border: ""
          }}
        />
      </div>
    </div>
  </div>
);
