import React, { useContext } from "react";
import { Widget, commonCss } from "./../widget";
import { WidgetPropType } from "./../widgetProps";
import { InferWidgetProps, StringPropOpt } from "./../propTypes";
import { registerWidget } from "./../register";
import { useDevice } from "../../hooks/useDevice";
import { parseResponse } from "./deviceParser";
import { parseObject } from "../EmbeddedDisplay/jsonParser";
import {
  errorWidget,
  WidgetDescription,
  widgetDescriptionToComponent
} from "../createComponent";
import { RelativePosition } from "../../../types/position";
import { BorderStyle, Border } from "../../../types/border";
import { Color } from "../../../types/color";
import { MacroContext } from "../../../types/macros";

const DeviceProps = {
  deviceName: StringPropOpt,
  name: StringPropOpt
};

export const DeviceComponent = (
  props: InferWidgetProps<typeof DeviceProps>
): JSX.Element => {
  // When replacing a detail panel, you can deduce device name
  // from the macro DESC on the screen.
  const displayMacros = useContext(MacroContext).macros;
  const deviceName = props.deviceName ?? (displayMacros["DESC"] || "");
  let componentDescription: WidgetDescription;
  let border = new Border(BorderStyle.Dotted, Color.DISCONNECTED, 3);
  const replacedDeviceName = `dev://${deviceName.replace(/\s/g, "")}`;
  const description = useDevice(replacedDeviceName);
  try {
    let jsonResponse = {};
    if (description && description.value) {
      jsonResponse = JSON.parse(description?.value?.stringValue || "");
      border = Border.NONE;
      const jsonObject = parseResponse(jsonResponse as any);

      componentDescription = parseObject(jsonObject, "ca");
    } else {
      componentDescription = errorWidget(
        `No device ${replacedDeviceName} found.`,
        new RelativePosition("100%", "50px")
      );
    }
  } catch {
    componentDescription = errorWidget(
      `Failed to load device widget ${deviceName}`
    );
  }
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
