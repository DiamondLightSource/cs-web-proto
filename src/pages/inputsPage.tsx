// Page with many inputs

import React from "react";

import { WidgetFromJson } from "../components/FromJson/fromJson";

export const InputsPage = (): JSX.Element => (
  <WidgetFromJson
    file="http://localhost:3000/inputsPage.json"
    macroMap={{}}
    containerStyling={{ position: "relative" }}
  />
);
