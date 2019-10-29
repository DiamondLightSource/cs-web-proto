// Page to show off graphical layouts
import React from "react";

import { WidgetFromJson } from "../components/FromJson/fromJson";

export const GraphicalPage = (): JSX.Element => (
  <WidgetFromJson
    file="http://localhost:3000/graphics.json"
    macroMap={{}}
    containerStyling={{ position: "relative" }}
  />
);
