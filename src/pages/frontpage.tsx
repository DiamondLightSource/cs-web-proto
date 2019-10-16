// Front page of application

import React from "react";

import {
  ConnectedReadback,
  ConnectedStandaloneReadback,
  ReadbackWidget,
  ConnectedReadbackWidget
} from "../components/Readback/readback";
import { ConnectedInput } from "../components/Input/input";
import { Label } from "../components/Label/label";
import { vstring } from "../vtypes/string";
import { Widget } from "../components/Widget/widget";
import { FlexContainer } from "../components/FlexContainer/flexContainer";

export const FrontPage = (): JSX.Element => (
  <div id="Central Column" style={{ width: "80%", margin: "auto" }}>
    <div>
      <ConnectedReadback pvName={"TMC43-TS-IOC-01:AI"} />
      <ConnectedReadback pvName={"loc://pv1"} />
      <ConnectedReadback pvName={"loc://pv2"} />
      <ConnectedReadback pvName={"sim://sine"} precision={3} />
      <ConnectedReadback pvName={"sim://disconnector"} precision={3} />
    </div>
    <div>
      <ConnectedInput pvName={"loc://pv1"} />
      <ConnectedInput pvName={"loc://pv2"} />
      <ConnectedInput pvName={"sim://sine"} />
      <ConnectedInput pvName={"sim://sine"} />
    </div>
    <div>
      <h3>PV with Metadata</h3>
      <div
        style={{
          position: "relative",
          display: "block",
          height: "30px",
          margin: "15px"
        }}
      >
        <div
          style={{
            display: "inline-block",
            position: "absolute",
            top: "0%",
            right: "50%",
            height: "100%",
            width: "50%",
            margin: "auto"
          }}
        >
          <ConnectedInput pvName={"meta://metapv1"} />
        </div>
        <div
          style={{
            display: "inline-block",
            position: "absolute",
            top: "0%",
            left: "50%",
            height: "100%",
            width: "50%",
            margin: "auto"
          }}
        >
          <ConnectedReadback pvName={"meta://metapv1"} />
        </div>
      </div>
      <div
        style={{
          position: "relative",
          height: "2em",
          margin: "15px auto"
        }}
      >
        <ConnectedStandaloneReadback pvName={"meta://metapv1"} precision={2} />
      </div>
      <div
        style={{
          position: "relative",
          display: "block",
          margin: "15px auto"
        }}
      >
        <Label text="Sim Enum" />
        <ConnectedInput pvName={"sim://enum"} />
        <ConnectedStandaloneReadback pvName={"sim://enum"} precision={2} />
      </div>
      <div
        style={{
          position: "relative",
          display: "block",
          margin: "15px auto"
        }}
      >
        <Label text="Local Enum - [0, 1, 2, 3, 4, 5]" />
        <ConnectedInput pvName={"enum://enum1"} />
        <ConnectedStandaloneReadback pvName={"enum://enum1"} />
      </div>
      <div>
        <Label text="Created with Widget" />
        <ReadbackWidget
          pvName="test://tim"
          connected={true}
          value={vstring("Testing")}
          containerStyling={{ flexible: true, margin: "5px" }}
          wrappers={{ alarmborder: true, copywrapper: true }}
        />
        <ConnectedReadbackWidget
          pvName="sim://enum"
          containerStyling={{ flexible: true, margin: "5px" }}
          wrappers={{ alarmborder: false, copywrapper: false }}
        />
        <ConnectedReadbackWidget
          pvName="sim://enum"
          containerStyling={{ flexible: true, margin: "5px" }}
          wrappers={{ alarmborder: false, copywrapper: true }}
        />
        <ConnectedReadbackWidget
          pvName="sim://enum"
          containerStyling={{ flexible: true, margin: "5px" }}
          wrappers={{ alarmborder: true, copywrapper: false }}
        />
        <ConnectedReadbackWidget
          pvName="${thisPV}"
          containerStyling={{
            flexible: true,
            margin: "5px"
          }}
          wrappers={{ alarmborder: true, copywrapper: true }}
          precision={3}
          macroMap={{ thisPV: "sim://sine" }}
        />
      </div>
      <div>
        <Widget
          baseWidget={FlexContainer}
          containerStyling={{ flexible: true, margin: "5px" }}
          wrappers={{ alarmborder: false, copywrapper: false }}
        >
          <Label
            text="Wrapped in a widget FlexContainer"
            style={{ width: "300px" }}
          />
          <ConnectedReadbackWidget
            pvName="${thisPV}"
            containerStyling={{
              flexible: true,
              width: "300px"
            }}
            wrappers={{ alarmborder: false, copywrapper: false }}
            precision={3}
            macroMap={{ thisPV: "sim://sine" }}
          />
        </Widget>
      </div>
    </div>
  </div>
);
