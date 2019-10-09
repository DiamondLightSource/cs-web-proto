// Simple page that loads from a JSON file directly.

import React from "react";

import { FromJson } from "../components/FromJson/fromJson";

export const JsonPage = (): JSX.Element => (
  <div
    id="Central Column"
    style={{
      position: "relative",
      height: "100%",
      width: "80%",
      margin: "auto"
    }}
  >
    <h2>Loading from JSON</h2>
    <div style={{ height: "100%", width: "100%", position: "relative" }}>
      <FromJson file="http://localhost:3000/simple.json" />
    </div>
  </div>
);
