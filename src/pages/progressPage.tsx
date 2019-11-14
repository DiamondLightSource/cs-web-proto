// Page to show off the progress bar and slide control
import React from "react";

import { WidgetFromJson } from "../components/FromJson/fromJson";

export const ProgressPage = (): JSX.Element => (
  <WidgetFromJson
    file="http://localhost:3000/progressPage.json"
    macroMap={{}}
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
