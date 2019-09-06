// Page to show off the absolute positiong example
import React from "react";

import { Mapping } from "../components/Positioning/ionpExample";

export const PositioningExamplePage = () => (
  <div style={{ position: "relative", height: "90%", width: "90%" }}>
    <Mapping />
  </div>
);
