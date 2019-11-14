import React, { memo } from "react";
import PropTypes from "prop-types";

import {
  Component,
  Widget,
  WidgetPropType,
  InferWidgetProps,
  FlatPositioned
} from "../Widget/widget";

const DisplayProps = {
  children: PropTypes.node
};

// Generic display widget to put other things inside
const DisplayComponent = (
  props: InferWidgetProps<typeof DisplayProps> & Component
): JSX.Element => (
  <div
    style={{ position: "relative", boxSizing: "border-box", ...props.style }}
  >
    {props.children}
  </div>
);

const DisplayWidgetProps = {
  ...DisplayProps,
  ...WidgetPropType
};

function areComponentPropsEqual(
  prevProps: Component,
  nextProps: Component
): boolean {
  let prevExpanded = {
    ...prevProps.style
  };
  let nextExpanded = {
    ...nextProps.style
  };

  if (JSON.stringify(prevExpanded) === JSON.stringify(nextExpanded)) {
    return true;
  } else {
    return false;
  }
}

export const Display = (
  props: InferWidgetProps<typeof DisplayWidgetProps>
): JSX.Element => <Widget baseWidget={DisplayComponent} {...props} />;

Display.propTypes = DisplayWidgetProps;
