import React from "react";

import classes from "./flexContainer.module.css";
import { Component, Widget, WidgetPropType } from "../Widget/widget";
import { registerWidget } from "../register";
import { ChildrenPropOpt, ChoicePropOpt, InferWidgetProps } from "../propTypes";

const FlexProps = {
  flexFlow: ChoicePropOpt(["rowWrap", "column", "row", "columnWrap"]),
  children: ChildrenPropOpt
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
