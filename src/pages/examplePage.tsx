// Page with many readbacks

import React from "react";

import { WidgetFromJson } from "../components/FromJson/fromJson";
import { RouteComponentProps } from "react-router-dom";

export const ExamplePage = ({
  history,
  match,
  location
}: RouteComponentProps<any>): JSX.Element => (
  <WidgetFromJson
    file="http://localhost:3000/examplePage.json"
    macroMap={{}}
    containerStyling={{
      position: "relative",
      height: "",
      width: "",
      margin: "",
      padding: ""
    }}
    history={history}
    match={match}
    location={location}
  />
);
