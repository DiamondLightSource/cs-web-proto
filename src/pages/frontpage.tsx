// Front page of application

import React from "react";

import { WidgetFromJson } from "../components/FromJson/fromJson";

export const FrontPage = (): JSX.Element => (
  <WidgetFromJson
    file="http://localhost:3000/frontPage.json"
    macroMap={{}}
    containerStyling={{ position: "relative" }}
  />
);
