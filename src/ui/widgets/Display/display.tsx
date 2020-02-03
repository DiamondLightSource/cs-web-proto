import React from "react";

import { Widget } from "../widget";
import { Component, WidgetPropType } from "../widgetProps";
import { registerWidget } from "../register";
import { ChoicePropOpt, ChildrenPropOpt, InferWidgetProps } from "../propTypes";

const DisplayProps = {
  children: ChildrenPropOpt,
  overflow: ChoicePropOpt(["scroll", "hidden", "auto", "visible"])
};

// Generic display widget to put other things inside
const DisplayComponent = (
  props: InferWidgetProps<typeof DisplayProps> & Component
): JSX.Element => (
  <div
    style={{
      position: "relative",
      boxSizing: "border-box",
      overflow: props.overflow,
      ...props.style
    }}
  >
    {props.children}
  </div>
);

const DisplayWidgetProps = {
  ...DisplayProps,
  ...WidgetPropType
};

export const Display = (
  props: InferWidgetProps<typeof DisplayWidgetProps>
): JSX.Element => <Widget baseWidget={DisplayComponent} {...props} />;

registerWidget(Display, DisplayWidgetProps, "display");
