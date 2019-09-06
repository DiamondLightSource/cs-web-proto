// Front page of application

import React from "react";

import {
  ConnectedReadback,
  ConnectedStandaloneReadback
} from "../components/Readback/readback";
import { ConnectedInput } from "../components/Input/input";

export const FrontPage = (): JSX.Element => (
  <div id="Central Column" style={{ width: "80%", margin: "auto" }}>
    <div style={{ display: "block" }}>
      <ConnectedReadback pvName={"TMC43-TS-IOC-01:AI"} />
      <ConnectedReadback pvName={"loc://pv1"} />
      <ConnectedReadback pvName={"loc://pv2"} />
      <ConnectedReadback pvName={"sim://sine"} precision={3} />
      <ConnectedReadback pvName={"sim://disconnector"} precision={3} />
    </div>
    <div style={{ display: "block" }}>
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
          height: "2em",
          margin: "15px auto"
        }}
      >
        <ConnectedStandaloneReadback
          pvName={"sim://disconnector"}
          precision={2}
        />
      </div>
    </div>
  </div>
);
