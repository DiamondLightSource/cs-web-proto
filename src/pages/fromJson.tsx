// Simple page that loads from a JSON file directly.

import React from "react";

import { WidgetFromJson } from "../components/FromJson/fromJson";

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
    <h2>Loading from JSON and Bob</h2>
    <div style={{ height: "100%", width: "100%", position: "relative" }}>
      <WidgetFromJson
        file="http://localhost:3000/simple.json"
        containerStyling={{
          position: "relative",
          height: "",
          width: "",
          margin: "",
          padding: "",
          border: "",
          minWidth: "",
          maxWidth: ""
        }}
      />
    </div>
  </div>
);
