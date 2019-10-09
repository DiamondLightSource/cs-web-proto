// Page to show off the absolute positiong example
import React from "react";

import { Mapping } from "../components/Positioning/flexExample";

export const FlexExamplePage = (): JSX.Element => (
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