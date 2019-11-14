// Demos from the coniql server, if running.

import React from "react";

import { WidgetFromJson } from "../components/FromJson/fromJson";
import { RouteComponentProps } from "react-router-dom";

export interface DynamicParams {
  json: string;
  macros: string;
}

export function DynamicPage({
  match
}: RouteComponentProps<DynamicParams>): JSX.Element {
  var file = "http://localhost:3000/" + match.params.json + ".json";
  var map = JSON.parse(match.params.macros);
  return (
    <WidgetFromJson
      file={file}
      macroMap={map}
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
}
