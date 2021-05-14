import React from "react";
import { Widget, commonCss } from "./../widget";
import { WidgetPropType } from "./../widgetProps";
import { InferWidgetProps, StringProp } from "./../propTypes";
import { registerWidget } from "./../register";
import { useDevice } from "../../hooks/useDevice";
import { parseResponse } from "./deviceParser";
import { parseObject } from "../EmbeddedDisplay/jsonParser";
import { widgetDescriptionToComponent } from "../createComponent";
import { RelativePosition } from "../../../types/position";
import { BorderStyle, Border } from "../../../types/border";
import { Color } from "../../../types/color";

const DeviceProps = {
  deviceName: StringProp
};

export const DeviceComponent = (
  props: InferWidgetProps<typeof DeviceProps>
): JSX.Element => {
  // Remove spaces from input
  const description = useDevice("dev://" + props.deviceName.replace(/\s/g, ""));

  let border = new Border(BorderStyle.Dotted, Color.DISCONNECTED, 3);
  let jsonResponse = {};
  if (description && description.value) {
    jsonResponse = JSON.parse(description?.value?.stringValue || "");
    border = Border.NONE;
  }
  const jsonObject = parseResponse(jsonResponse as any);

  const componentDescription = parseObject(jsonObject, "ca");

  const Component = widgetDescriptionToComponent({
    position: new RelativePosition("100%", "100%"),
    type: "display",
    children: [componentDescription]
  });

  const style = commonCss({ border });
  return <div style={style}>{Component}</div>;
};

const DeviceWidgetProps = {
  ...DeviceProps,
  ...WidgetPropType
};

export const Device = (
  props: InferWidgetProps<typeof DeviceWidgetProps>
): JSX.Element => <Widget baseWidget={DeviceComponent} {...props} />;

registerWidget(Device, DeviceWidgetProps, "device");
