import React from "react";
import PropTypes from "prop-types";

import {
  Component,
  Widget,
  WidgetPropType,
  InferWidgetProps
} from "../Widget/widget";

const GroupingContainerProps = {
  name: PropTypes.string.isRequired,
  children: PropTypes.node
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
    <div style={{ position: "absolute", top: "20px", left: "20px" }}>
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

GroupingContainer.propTypes = GroupingWidgetProps;
