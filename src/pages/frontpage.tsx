// Front page of application

import React from "react";

import { WidgetFromJson } from "../components/FromJson/fromJson";

export const FrontPage = (): JSX.Element => (
  <WidgetFromJson
    file="http://localhost:5000/frontPage.json"
    containerStyling={{
      position: "relative",
      height: "",
      width: "",
      margin: "",
      padding: ""
    }}
  />
);
