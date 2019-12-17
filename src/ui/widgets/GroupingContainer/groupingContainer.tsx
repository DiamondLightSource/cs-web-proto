import React from "react";

import { Component, Widget, WidgetPropType } from "../widget";
import { registerWidget } from "../register";
import { StringProp, ChildrenPropOpt, InferWidgetProps } from "../propTypes";

const GroupingContainerProps = {
  name: StringProp,
  children: ChildrenPropOpt
};

// Generic display widget to put other things inside
export const GroupingContainerComponent = (
  props: InferWidgetProps<typeof GroupingContainerProps> & Component
): JSX.Element => (
  // Uses an inner margin for children similar to Phoebus
  // This prevents the title being overwritten
  // Could be changed or perhaps customisable as a prop
  <fieldset
    style={{
      boxSizing: "border-box",
      ...props.style
    }}
  >
    <legend>{props.name}</legend>
    <div style={{ position: "relative", height: "100%", width: "100%" }}>
      {props.children}
    </div>
  </fieldset>
);

const GroupingWidgetProps = {
  ...GroupingContainerProps,
  ...WidgetPropType
};

export const GroupingContainer = (
  props: InferWidgetProps<typeof GroupingWidgetProps>
): JSX.Element => <Widget baseWidget={GroupingContainerComponent} {...props} />;

registerWidget(GroupingContainer, GroupingWidgetProps, "grouping");
