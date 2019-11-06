// Page with many inputs

import React from "react";

import { WidgetFromJson } from "../components/FromJson/fromJson";

export const ShapesPage = (): JSX.Element => (
  <WidgetFromJson
    file="http://localhost:3000/shapesPage.json"
    containerStyling={{
      position: "relative",
      height: "",
      width: "",
      margin: "",
      padding: ""
    }}
  />
);
