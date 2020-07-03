import React from "react";
import log from "loglevel";

import { Widget, commonCss } from "./widget";
import { WidgetPropType } from "./widgetProps";

import {
  IntPropOpt,
  BoolPropOpt,
  InferWidgetProps,
  ChoicePropOpt,
  FontPropOpt,
  ColorPropOpt,
  BorderPropOpt,
  StringProp
} from "./propTypes";

import { parseJson } from "./EmbeddedDisplay/jsonParser";

import {
  WidgetDescription,
  widgetDescriptionToComponent
} from "./createComponent";

import { PV } from "../../types/pv";

import { useDevice } from "../hooks/useDevice";

import { registerWidget } from "./register";
import { RelativePosition } from "../../types/position";
import { js2xml } from "xml-js";

const DeviceProps = {
  //children: ChildrenPropOpt,
  //overflow: ChoicePropOpt(["scroll", "hidden", "auto", "visible"]),
  //backgroundColor: ColorPropOpt,
  //border: BorderPropOpt,
  //macros: MacrosPropOpt
  deviceName: StringProp
};

const DeviceComponent = (
  props: InferWidgetProps<typeof DeviceProps>
): JSX.Element => {

  /* Add connection to PV and then recursively wrap widgets */

  console.log("testing ...", props.deviceName);

  let components : string = '';
  console.log("aiming ...");
  components = useDevice("", "csim://"+props.deviceName);

  console.log("what is ...", components);

  let description = parseJson(components, "pva");
  if (props.deviceName == "Xspress3.Channel1") {
    const test = '{"type":"progressbar","position":"relative","width":"25%","pvName":"csim://sine(-10,10,100,0.1)"}';
    description = parseJson(test, "pva");
  }
  //const widget_ = widgetDescriptionToComponent(widget);
  const component = widgetDescriptionToComponent({
    position: new RelativePosition("100%","100%"),
    type: "display",
    children: [description]
  });

  return <div>{props.deviceName}:{component}</div>;

};

const DeviceWidgetProps = {
  ...DeviceProps,
  ...WidgetPropType
};

export const Device = (
  props: InferWidgetProps<typeof DeviceWidgetProps>
): JSX.Element => <Widget baseWidget={DeviceComponent} {...props} />;

registerWidget(Device, DeviceWidgetProps, "device");

