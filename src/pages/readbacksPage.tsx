// Page with many readbacks

import React from "react";

import { WidgetFromJson } from "../components/FromJson/fromJson";

export const ReadbacksPage = (): JSX.Element => (
  <WidgetFromJson
    file="http://localhost:3000/readbacksPage.json"
    macroMap={{}}
    containerStyling={{ position: "relative" }}
  />
);
