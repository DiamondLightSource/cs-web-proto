import React, { CSSProperties } from "react";

import { Widget } from "../widget";
import { WidgetPropType } from "../widgetProps";
import { registerWidget } from "../register";
import {
  StringProp,
  ChildrenPropOpt,
  InferWidgetProps,
  ColorPropOpt,
  BoolPropOpt
} from "../propTypes";

const GroupBoxProps = {
  name: StringProp,
  children: ChildrenPropOpt,
  backgroundColor: ColorPropOpt,
  compat: BoolPropOpt
};

// Widget that renders a group-box style border showing the name prop.
// This could be replaced if we can implement this as part of the
// border prop.
export const GroupBoxComponent = (
  props: InferWidgetProps<typeof GroupBoxProps>
): JSX.Element => {
  const { compat = false } = props;
  // Manually render a group-box style border.
  const innerDivStyle: CSSProperties = {
    position: "relative",
    padding: "16px"
  };
  // Specific styling to match the group boxes in opibuilder.
  if (compat) {
    innerDivStyle.padding = undefined;
    innerDivStyle.top = "16px";
    innerDivStyle.left = "16px";
    innerDivStyle.height = "calc(100% - 32px)";
    innerDivStyle.width = "calc(100% - 32px)";
    innerDivStyle.overflow = "hidden";
  }
  // Dimensions match those in the opibuilder groupbox borders.
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        outline: "1px dotted black",
        outlineOffset: "-7px",
        backgroundColor: "transparent"
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "0",
          left: "20px",
          fontSize: "13px",
          padding: "0 2px 0 2px",
          backgroundColor:
            props.backgroundColor?.toString() ?? "rgb(200,200,200)"
        }}
      >
        {props.name}
      </div>
      <div style={innerDivStyle}>{props.children}</div>
    </div>
  );
};

const GroupBoxWidgetProps = {
  ...WidgetPropType,
  name: StringProp,
  children: ChildrenPropOpt
};

export const GroupBox = (
  props: InferWidgetProps<typeof GroupBoxWidgetProps>
): JSX.Element => <Widget baseWidget={GroupBoxComponent} {...props} />;

registerWidget(GroupBox, GroupBoxWidgetProps, "groupbox");
