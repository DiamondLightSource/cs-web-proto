import React from "react";

import classes from "./flexContainer.module.css";
import { Widget, commonCss } from "../widget";
import { WidgetPropType } from "../widgetProps";
import { registerWidget } from "../register";
import {
  ChildrenPropOpt,
  ChoicePropOpt,
  InferWidgetProps,
  BorderPropOpt,
  ColorPropOpt
} from "../propTypes";

const FlexProps = {
  flexFlow: ChoicePropOpt(["rowWrap", "column", "row", "columnWrap"]),
  justifyContent: ChoicePropOpt([
    "space-around",
    "center",
    "flex-start",
    "flex-end"
  ]),
  children: ChildrenPropOpt,
  backgroundColor: ColorPropOpt,
  border: BorderPropOpt
};

export const FlexContainerComponent = (
  props: InferWidgetProps<typeof FlexProps>
): JSX.Element => {
  const { flexFlow = undefined, justifyContent = undefined } = props;
  const style = {
    ...commonCss(props),
    flexFlow,
    justifyContent
  };
  return (
    <div className={classes.FlexContainer} style={style}>
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
