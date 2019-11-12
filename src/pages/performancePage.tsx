// Page with many inputs

import React from "react";

import { WidgetFromJson } from "../components/FromJson/fromJson";

export const PerformancePage = (): JSX.Element => (
  <WidgetFromJson
    file="http://pc0030.cs.diamond.ac.uk:3000/performancePage.json"
    macroMap={{}}
    containerStyling={{ position: "relative" }}
  />
);
