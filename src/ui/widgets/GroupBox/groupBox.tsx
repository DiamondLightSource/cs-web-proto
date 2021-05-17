import React from "react";

import { Widget } from "../widget";
import { WidgetPropType } from "../widgetProps";
import { registerWidget } from "../register";
import {
  StringProp,
  ChildrenPropOpt,
  InferWidgetProps,
  ColorPropOpt
} from "../propTypes";

const GroupBoxProps = {
  name: StringProp,
  children: ChildrenPropOpt,
  backgroundColor: ColorPropOpt
};

// Widget that renders a group-box style border showing the name prop.
// This could be replaced if we can implement this as part of the
// border prop.
export const GroupBoxComponent = (
  props: InferWidgetProps<typeof GroupBoxProps>
): JSX.Element => (
  // Manually render a group-box style border.
  // Dimensions match those in the opibuilder groupbox borders.
  <div
    style={{
      width: "100%",
      height: "100%",
      outline: "1px dotted black",
      outlineOffset: "-7px",
      backgroundColor: "transparent"
    }}
  >
    <div
      style={{
        position: "absolute",
        top: "0",
        left: "20px",
        fontSize: "13px",
        padding: "0 2px 0 2px",
        backgroundColor: props.backgroundColor?.toString() ?? "rgb(200,200,200)"
      }}
    >
      {props.name}
    </div>
    <div
      style={{
        position: "relative",
        top: "16px",
        left: "16px",
        height: "calc(100% - 35px)",
        width: "calc(100% - 35px)",
        overflow: "hidden"
      }}
    >
      {props.children}
    </div>
  </div>
);

const GroupBoxWidgetProps = {
  ...WidgetPropType,
  name: StringProp,
  children: ChildrenPropOpt
};

export const GroupBox = (
  props: InferWidgetProps<typeof GroupBoxWidgetProps>
): JSX.Element => <Widget baseWidget={GroupBoxComponent} {...props} />;

registerWidget(GroupBox, GroupBoxWidgetProps, "groupbox");
