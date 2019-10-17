import React, { ReactNode } from "react";

import { macroWrapper } from "../MacroWrapper/macroWrapper";
import { MacroMap } from "../../redux/csState";
import { Widget, WidgetInterface } from "../Widget/widget";

// Generic display widget to put other things inside
const DisplayComponent = (props: {
  style?: object;
  children?: ReactNode;
}): JSX.Element => (
  <div
    style={{ position: "relative", boxSizing: "border-box", ...props.style }}
  >
    {props.children}
  </div>
);

interface MacroDisplayProps {
  style?: object;
  children?: ReactNode;
  macroMap: MacroMap;
}

const MacroDisplayComponent: React.FC<MacroDisplayProps> = macroWrapper(
  DisplayComponent
);

export const Display = (props: WidgetInterface): JSX.Element => (
  <Widget baseWidget={MacroDisplayComponent} {...props} />
);
