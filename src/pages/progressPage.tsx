// Page to show off the progress bar and slide control
import React from "react";

import { ConnectedInput } from "../components/Input/input";
import { ConnectedStandaloneReadback } from "../components/Readback/readback";
import { ConnectedProgressBarWidget } from "../components/ProgressBar/progressBar";
import { ConnectedSlideControl } from "../components/SlideControl/slideControl";
import { WidgetFromJson } from "../components/FromJson/fromJson";

export const ProgressPage = (): JSX.Element => (
  <WidgetFromJson
    file="http://localhost:3000/progressPage.json"
    macroMap={{}}
  />
);
