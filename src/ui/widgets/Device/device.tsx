import React from "react";
import { Widget } from "./../widget";
import { WidgetPropType } from "./../widgetProps";
import { InferWidgetProps, StringPropOpt, StringProp } from "./../propTypes";
import { registerWidget } from "./../register";
import { useDevice } from "../../hooks/useDevice";
import { deviceParser } from "./deviceParser";
import { parseJson } from "../EmbeddedDisplay/jsonParser";
import { widgetDescriptionToComponent } from "../createComponent";
import { RelativePosition } from "../../../types/position";
import { GroupBoxComponent } from "../GroupBox/groupBox";

const DeviceProps = {
  deviceName: StringProp,
  id: StringPropOpt
};

const DeviceComponent = (
  props: InferWidgetProps<typeof DeviceProps>
): JSX.Element => {
  const description = useDevice(props.id || "", props.deviceName);
  const jsonString = deviceParser(description?.value?.toString());

  const componentDescription = parseJson(jsonString, "pva");

  const component = widgetDescriptionToComponent({
    position: new RelativePosition("100%", "100%"),
    type: "display",
    children: [componentDescription]
  });
  return (
    <GroupBoxComponent name={props.deviceName}>{component}</GroupBoxComponent>
  );
};

const DeviceWidgetProps = {
  ...DeviceProps,
  ...WidgetPropType
};

export const Device = (
  props: InferWidgetProps<typeof DeviceWidgetProps>
): JSX.Element => <Widget baseWidget={DeviceComponent} {...props} />;

registerWidget(Device, DeviceWidgetProps, "device");
