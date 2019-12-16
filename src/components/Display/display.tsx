import React from "react";
import PropTypes from "prop-types";

import {
  Component,
  Widget,
  WidgetPropType,
  InferWidgetProps
} from "../Widget/widget";
import { registerWidget } from "../register";

const DisplayProps = {
  children: PropTypes.node,
  overflow: PropTypes.oneOf(["scroll", "hidden", "auto", "visible"])
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
