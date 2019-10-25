import React, { ReactNode } from "react";

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

export const Display = (props: WidgetInterface): JSX.Element => (
  <Widget baseWidget={DisplayComponent} {...props} />
);
