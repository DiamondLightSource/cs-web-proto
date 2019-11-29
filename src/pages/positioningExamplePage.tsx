// Page to show off the absolute positiong example
import React from "react";

import { WidgetFromJson } from "../components/FromJson/fromJson";

export const PositioningExamplePage = (): JSX.Element => (
  <WidgetFromJson
    file="http://localhost:3000/ionpExample.json"
    macroMap={{ device: "SR03A-VA-IONP-01" }}
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
);
