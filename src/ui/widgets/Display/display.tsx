import React from "react";

import { Widget, commonCss } from "../widget";
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
): JSX.Element => {
  const style = commonCss(props);
  style["position"] = "relative";
  style["overflow"] = props.overflow;
  style["height"] = "100%";
  return <div style={style}>{props.children}</div>;
};

const DisplayWidgetProps = {
  ...DisplayProps,
  ...WidgetPropType
};

export const Display = (
  props: InferWidgetProps<typeof DisplayWidgetProps>
): JSX.Element => <Widget baseWidget={DisplayComponent} {...props} />;

registerWidget(Display, DisplayWidgetProps, "display");
