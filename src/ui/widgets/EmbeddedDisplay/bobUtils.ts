import {
  xmlToWidgets,
  OPI_FUNCTION_SUBSTITUTIONS,
  OPI_KEY_SUBSTITUTIONS,
  XmlDescription
} from "./opiUtils";
import { WidgetDescription } from "../createComponent";

const BOB_WIDGET_IDS: { [key: string]: string } = {
  textupdate: "readback",
  textentry: "input",
  label: "label",
  group: "grouping",
  rectangle: "shape",
  action_button: "actionbutton" // eslint-disable-line @typescript-eslint/camelcase
};

export function bobGetWidgetId(xmlDescription: XmlDescription): string {
  return xmlDescription._attributes.type;
}

export function bobSetWidgetId(
  xmlDescription: XmlDescription,
  newId: string
): void {
  xmlDescription._attributes.type = newId;
}

export function bobToWidgets(bobString: string): WidgetDescription {
  return xmlToWidgets(
    bobString,
    bobGetWidgetId,
    bobSetWidgetId,
    BOB_WIDGET_IDS,
    OPI_FUNCTION_SUBSTITUTIONS,
    OPI_KEY_SUBSTITUTIONS
  );
}
