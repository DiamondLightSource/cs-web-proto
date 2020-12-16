import React from "react";
import { Widget } from "./../widget";
import { WidgetPropType } from "./../widgetProps";
import { InferWidgetProps, StringProp } from "./../propTypes";
import { registerWidget } from "./../register";
import { useDevice } from "../../hooks/useDevice";
import { parseResponse } from "./deviceParser";
import { parseJson } from "../EmbeddedDisplay/jsonParser";
import { widgetDescriptionToComponent } from "../createComponent";
import { RelativePosition } from "../../../types/position";

const DeviceProps = {
  deviceName: StringProp
};

export const DeviceComponent = (
  props: InferWidgetProps<typeof DeviceProps>
): JSX.Element => {
  // Remove spaces from input
  const description = useDevice("dev://" + props.deviceName.replace(/\s/g, ""));

  let jsonResponse = {};
  if (description && description.value) {
    jsonResponse = JSON.parse(description?.value?.stringValue || "");
  }
  const jsonString = parseResponse(jsonResponse as any);

  const componentDescription = parseJson(jsonString, "pva");

  const Component = widgetDescriptionToComponent({
    position: new RelativePosition("100%", "100%"),
    type: "display",
    children: [componentDescription]
  });

  return Component;
};

const DeviceWidgetProps = {
  ...DeviceProps,
  ...WidgetPropType
};

export const Device = (
  props: InferWidgetProps<typeof DeviceWidgetProps>
): JSX.Element => <Widget baseWidget={DeviceComponent} {...props} />;

registerWidget(Device, DeviceWidgetProps, "device");
