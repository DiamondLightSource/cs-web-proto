import React from "react";
import PropTypes from "prop-types";

import classes from "./flexContainer.module.css";
import {
  Component,
  Widget,
  WidgetPropType,
  InferWidgetProps
} from "../Widget/widget";
import { registerWidget } from "../register";

const FlexProps = {
  flexFlow: PropTypes.oneOf(["rowWrap", "column", "row", "columnWrap"]),
  children: PropTypes.node
};

export const FlexContainerComponent = (
  props: InferWidgetProps<typeof FlexProps> & Component
): JSX.Element => {
  let classNames = [classes.FlexContainer];
  let { flexFlow = null } = props;
  if (flexFlow !== null) {
    classNames.push(classes[flexFlow]);
  }
  return (
    <div className={classNames.join(" ")} style={props.style}>
      {props.children}
    </div>
  );
};

const FlexWidgetProps = {
  ...FlexProps,
  ...WidgetPropType
};

export const FlexContainer = (
  props: InferWidgetProps<typeof FlexWidgetProps>
): JSX.Element => <Widget baseWidget={FlexContainerComponent} {...props} />;

registerWidget(FlexContainer, FlexWidgetProps, "flexcontainer");
