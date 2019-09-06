// Page to show off the absolute positiong example
import React from "react";

import { Mapping } from "../components/Positioning/ionpExample";

export const PositioningExamplePage = () => (
  <div
    style={{
      position: "relative",
      height: "100%",
      width: "100%",
      textAlign: "center"
    }}
  >
    <h2>Abolute Positioning Example</h2>
    <Mapping />
  </div>
);