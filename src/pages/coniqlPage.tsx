// Demos from the coniql server, if running.

import React from "react";

import { WidgetFromJson } from "../components/FromJson/fromJson";

export const ConiqlPage = (): JSX.Element => (
  <WidgetFromJson
    file="http://localhost:3000/coniqlPage.json"
    containerStyling={{
      position: "relative",
      height: "",
      width: "",
      margin: "",
      padding: "",
      border: ""
    }}
  />
);
