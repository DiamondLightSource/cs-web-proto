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
  // Uses an inner margin for children similar to Phoebus
  // This prevents the title being overwritten
  // Could be changed or perhaps customisable as a prop
  <fieldset
    style={{
      height: "100%",
      width: "100%",
      backgroundColor: props.backgroundColor?.toString(),
      margin: 0,
      padding: 0
    }}
  >
    <legend>{props.name}</legend>
    <div
      style={{
        position: "relative",
        height: "100%",
        width: "100%",
        backgroundColor: props.backgroundColor?.toString()
      }}
    >
      {props.children}
    </div>
  </fieldset>
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
