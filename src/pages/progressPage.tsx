// Page to show off the progress bar and slide control
import React from "react";

import { ConnectedInput } from "../components/Input/input";
import { ConnectedStandaloneReadback } from "../components/Readback/readback";
import { ConnectedStandaloneProgressBar } from "../components/ProgressBar/progressBar";
import { ConnectedSlideControl } from "../components/SlideControl/slideControl";

export const ProgressPage = (): JSX.Element => (
  <div id="Central Column" style={{ width: "80%", margin: "auto" }}>
    <h3>Input: ProgressPV</h3>
    <ConnectedInput pvName={"meta://ProgressPV"} />
    <h3>Readback: ProgressPV</h3>
    <ConnectedStandaloneReadback pvName={"meta://ProgressPV"} />
    <h3>Progress Bar: ProgressPV</h3>
    <div
      style={{
        position: "relative",
        display: "block",
        height: "60px",
        width: "100%"
      }}
    >
      <ConnectedStandaloneProgressBar
        pvName={"meta://ProgressPV"}
        min={0}
        max={100}
      />
    </div>
    <h3>Slide Control: ProgressPV</h3>
    <div
      style={{
        position: "relative",
        display: "block",
        height: "60px",
        width: "100%"
      }}
    >
      <ConnectedSlideControl pvName={"meta://ProgressPV"} min={0} max={100} />
    </div>
  </div>
);
