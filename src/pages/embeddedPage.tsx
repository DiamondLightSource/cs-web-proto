// Simple page that loads from a JSON file directly.

import React from "react";

import { WidgetFromJson } from "../components/FromJson/fromJson";

export const EmbeddedPage = (): JSX.Element => (
  <div
    id="Central Column"
    style={{
      position: "relative",
      height: "100%",
      width: "80%",
      margin: "auto"
    }}
  >
    <div style={{ height: "100%", width: "100%" }}>
      <WidgetFromJson
        file="http://localhost:3000/embeddedScreens/flexiEmbedded.json"
        containerStyling={{ position: "relative" }}
      />
    </div>
  </div>
);
