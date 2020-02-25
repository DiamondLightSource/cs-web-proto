import React from "react";

import { Widget } from "../widget";
import { WidgetPropType } from "../widgetProps";
import { registerWidget } from "../register";
import {
  ChoicePropOpt,
  ChildrenPropOpt,
  InferWidgetProps,
  ColorPropOpt,
  BorderPropOpt
} from "../propTypes";

const DisplayProps = {
  children: ChildrenPropOpt,
  overflow: ChoicePropOpt(["scroll", "hidden", "auto", "visible"]),
  backgroundColor: ColorPropOpt,
  border: BorderPropOpt
};

// Generic display widget to put other things inside
const DisplayComponent = (
  props: InferWidgetProps<typeof DisplayProps>
): JSX.Element => (
  <div
    style={{
      position: "relative",
      height: "100%",
      overflow: props.overflow,
      backgroundColor: props.backgroundColor?.rgbaString(),
      ...props.border?.asStyle()
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
