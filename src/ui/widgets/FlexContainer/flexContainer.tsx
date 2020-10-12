import React from "react";

import classes from "./flexContainer.module.css";
import { Widget, useCommonCss } from "../widget";
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
  children: ChildrenPropOpt,
  backgroundColor: ColorPropOpt,
  border: BorderPropOpt
};

export const FlexContainerComponent = (
  props: InferWidgetProps<typeof FlexProps>
): JSX.Element => {
  const style = useCommonCss(props);
  const classNames = [classes.FlexContainer];
  const { flexFlow = null } = props;
  if (flexFlow !== null) {
    classNames.push(classes[flexFlow]);
  }
  return (
    <div className={classNames.join(" ")} style={style}>
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
