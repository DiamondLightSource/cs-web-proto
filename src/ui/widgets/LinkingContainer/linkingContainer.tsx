import React from "react";
import { Widget } from "../widget";
import {
  InferWidgetProps,
  StringPropOpt,
  FloatPropOpt,
  BoolProp
} from "../propTypes";
import { PVComponent, PVWidgetPropType } from "../widgetProps";
import { registerWidget } from "../register";

export const LinkingContainerProps = {};

export type LinkingContainerComponentProps = InferWidgetProps<
  typeof LinkingContainerProps
> &
  PVComponent;

export const LinkingContainerComponent = (
  props: LinkingContainerComponentProps
): JSX.Element => {
  return <div>{"stuff"}</div>;
};

const LinkingContainerWidgetProps = {
  ...LinkingContainerProps,
  ...PVWidgetPropType
};

export const LinkingContainer = (
  props: InferWidgetProps<typeof LinkingContainerWidgetProps>
): JSX.Element => <Widget baseWidget={LinkingContainerComponent} {...props} />;

registerWidget(
  LinkingContainer,
  LinkingContainerWidgetProps,
  "linkingcontainer"
);
