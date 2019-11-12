import React, { memo } from "react";
import PropTypes from "prop-types";

import {
  Component,
  Widget,
  WidgetPropType,
  InferWidgetProps,
  FlatPositioned,
  FlatWidget
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

const DisplayMemo = memo(DisplayComponent, areComponentPropsEqual);

export const Display = (
  props: InferWidgetProps<typeof DisplayWidgetProps>
): JSX.Element => <Widget baseWidget={DisplayComponent} {...props} />;

Display.propTypes = DisplayWidgetProps;

export const FlatDisplayComponent = (
  props: InferWidgetProps<typeof DisplayProps> & FlatPositioned
): JSX.Element => (
  <div
    style={{
      boxSizing: "border-box",
      position: "absolute",
      top: props.y,
      left: props.x,
      height: props.height,
      width: props.width,
      padding: props.padding,
      margin: props.margin,
      backgroundColor: props.backgroundColor
    }}
  >
    {props.children}
  </div>
);

export const FlatDisplay = (
  props: InferWidgetProps<typeof DisplayProps> & FlatPositioned
): JSX.Element => (
  <FlatWidget Component={memo(FlatDisplayComponent)} {...props} />
);
