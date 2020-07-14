import React from "react";

import { Widget } from "./../widget";
import { WidgetPropType } from "./../widgetProps";

import {
  InferWidgetProps,
  StringProp
} from "./../propTypes";

import { parseJson } from "./../EmbeddedDisplay/jsonParser";

import {
  widgetDescriptionToComponent
} from "./../createComponent";

import { useDevice } from "../../hooks/useDevice";

import { registerWidget } from "./../register";
import { RelativePosition } from "../../../types/position";

import { coniqlToJSON } from "./coniqlParser";

const DeviceProps = {
  deviceName: StringProp
};

const DeviceComponent = (
  props: InferWidgetProps<typeof DeviceProps>
): JSX.Element => {

  let components : string = '';
  components = coniqlToJSON(useDevice("csim://"+props.deviceName));

  let description = parseJson(components, "pva");

  const component = widgetDescriptionToComponent({
    position: new RelativePosition("100%","100%"),
    type: "display",
    children: [description]
  });

  return <div>{props.deviceName}{component}</div>;

};

const DeviceWidgetProps = {
  ...DeviceProps,
  ...WidgetPropType
};

export const Device = (
  props: InferWidgetProps<typeof DeviceWidgetProps>
): JSX.Element => <Widget baseWidget={DeviceComponent} {...props} />;

registerWidget(Device, DeviceWidgetProps, "device");

