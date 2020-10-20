import React from "react";
import { Widget } from "../widget";
import { InferWidgetProps } from "../propTypes";
import { PVComponent, PVWidgetPropType } from "../widgetProps";
import { registerWidget } from "../register";

export const CheckboxProps = {};

export type CheckboxComponentProps = InferWidgetProps<typeof CheckboxProps> &
  PVComponent;

export const CheckboxComponent = (
  props: CheckboxComponentProps
): JSX.Element => {
  return <div>{"Component is rendered"}</div>;
};

const LedWidgetProps = {
  ...CheckboxProps,
  ...PVWidgetPropType
};

export const Checkbox = (
  props: InferWidgetProps<typeof LedWidgetProps>
): JSX.Element => <Widget baseWidget={CheckboxComponent} {...props} />;

registerWidget(Checkbox, LedWidgetProps, "checkbox");
