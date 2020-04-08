import React, { ReactElement } from "react";
import PropTypes from "prop-types";
import log from "loglevel";
import Drawer from "@material-ui/core/Drawer";

import { Widget } from "../widget";
import { WidgetPropType } from "../widgetProps";
import { registerWidget } from "../register";
import { InferWidgetProps } from "../propTypes";
import { Font } from "../../../types/font";
import { Color } from "../../../types/color";

export const DrawerProps = {
  children: PropTypes.arrayOf(PropTypes.element),
};

export const DrawerComponent = (props: {
  children: [ReactElement];
}): JSX.Element => {
  return <Drawer>{props.children}</Drawer>;
};

export const DrawerWidgetProps = {
  ...DrawerProps,
  ...WidgetPropType,
};

export const DrawerWidget = (
  props: InferWidgetProps<typeof DrawerWidgetProps>
): JSX.Element => <Widget baseWidget={DrawerComponent} {...props} />;

registerWidget(DrawerWidget, DrawerWidgetProps, "drawer");
