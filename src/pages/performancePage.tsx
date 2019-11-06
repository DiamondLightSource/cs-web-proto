// Page with many inputs

import React from "react";

import { WidgetFromJson } from "../components/FromJson/fromJson";

export const PerformancePage = (): JSX.Element => (
  <WidgetFromJson
    file="http://localhost:3000/performancePage.json"
    containerStyling={{
      position: "relative",
      height: "",
      width: "",
      margin: "",
      padding: ""
    }}
  />
);