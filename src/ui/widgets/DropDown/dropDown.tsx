import React from "react";

import classes from "./dropDown.module.css";
import { Widget } from "../widget";
import { WidgetPropType } from "../widgetProps";
import { registerWidget } from "../register";
import {
  BoolPropOpt,
  StringProp,
  StringOrNumPropOpt,
  InferWidgetProps,
  ChildrenPropOpt,
  FontPropOpt,
  BorderPropOpt,
  ColorPropOpt
} from "../propTypes";

const DropDownContainerProps = {
  title: StringProp,
  open: BoolPropOpt,
  font: FontPropOpt,
  border: BorderPropOpt,
  minHeight: StringOrNumPropOpt,
  foregroundColor: ColorPropOpt,
  backgroundColor: ColorPropOpt,
  children: ChildrenPropOpt
};

const DropDownWidgetProps = {
  ...DropDownContainerProps,
  ...WidgetPropType
};

export const DropDownComponent = (
  props: InferWidgetProps<typeof DropDownContainerProps>
): JSX.Element => (
  <details
    className={classes.Detail}
    open={props.open ?? false}
    style={{
      ...props.border?.css(),
      color: props.foregroundColor?.toString() ?? "",
      backgroundColor: props.backgroundColor?.toString() ?? "",
      minHeight: props.minHeight ?? ""
    }}
  >
    <summary className={classes.Summary} style={{ ...props.font?.css() }}>
      {props.title}
    </summary>
    <div
      className={classes.Children}
      style={{ position: "relative", height: "100%", width: "100%" }}
    >
      {props.children}
    </div>
  </details>
);

type DropDownWidget = InferWidgetProps<typeof DropDownWidgetProps>;

export const DropDown = (props: DropDownWidget): JSX.Element => (
  <Widget baseWidget={DropDownComponent} {...props} />
);

registerWidget(DropDown, DropDownWidgetProps, "dropdown");
