// Page with many readbacks

import React from "react";
import { WidgetFromJson } from "../components/FromJson/fromJson";

export const ExamplePage = (): JSX.Element => (
  <WidgetFromJson
    file="http://localhost:3000/examplePage.json"
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
