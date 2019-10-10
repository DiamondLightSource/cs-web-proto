// Page to show off the absolute positiong example
import React from "react";

import { FromJson } from "../components/FromJson/fromJson";

export const FlexExamplePage = (): JSX.Element => (
  <FromJson file="http://localhost:3000/flexiblePage.json" macroMap={{}} />
);
