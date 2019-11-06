// Page to show off the absolute positiong example
import React from "react";

import { WidgetFromJson } from "../components/FromJson/fromJson";

export const FlexExamplePage = (): JSX.Element => (
  <WidgetFromJson
    file="http://localhost:3000/flexiblePage.json"
    containerStyling={{
      position: "relative",
      height: "",
      width: "",
      margin: "",
      padding: ""
    }}
  />
);
