import React from "react";
import { Widget } from "./../widget";
import { WidgetPropType } from "./../widgetProps";
import { InferWidgetProps, StringPropOpt, StringProp } from "./../propTypes";
import { parseJson } from "./../EmbeddedDisplay/jsonParser";
import { widgetDescriptionToComponent } from "./../createComponent";
import { registerWidget } from "./../register";
import { useId } from "react-id-generator";
import { RelativePosition } from "../../../types/position";
import { coniqlToJSON } from "./coniqlParser";
import { useDevice } from "../../hooks/useDevice";

const DeviceProps = {
  deviceName: StringProp,
  id: StringPropOpt
};

const DeviceComponent = (
  props: InferWidgetProps<typeof DeviceProps>
): JSX.Element => {
  // let components = "";
  const device = useDevice(props.id || "", props.deviceName);
  // const components = coniqlToJSON(device);

  // const description = parseJson(components, "pva");

  // const component = widgetDescriptionToComponent({
  //   position: new RelativePosition("100%", "100%"),
  //   type: "display",
  //   children: [description]
  // });

  return <div>{device || ""}</div>;
};

const DeviceWidgetProps = {
  ...DeviceProps,
  ...WidgetPropType
};

export const Device = (
  props: InferWidgetProps<typeof DeviceWidgetProps>
): JSX.Element => <Widget baseWidget={DeviceComponent} {...props} />;

registerWidget(Device, DeviceWidgetProps, "device");
