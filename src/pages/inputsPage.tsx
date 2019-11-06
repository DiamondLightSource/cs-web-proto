// Page with many inputs

import React from "react";

import { WidgetFromJson } from "../components/FromJson/fromJson";

export const InputsPage = (): JSX.Element => (
  <WidgetFromJson
    file="http://localhost:3000/inputsPage.json"
    containerStyling={{
      position: "relative",
      height: "",
      width: "",
      margin: "",
      padding: ""
    }}
  />
);
