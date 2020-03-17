import { REGISTERED_WIDGETS } from "../register";
import { ComplexParserDict, parseWidget } from "./parser";
import {
  XmlDescription,
  OPI_COMPLEX_PARSERS,
  PATCHERS,
  OPI_SIMPLE_PARSERS
} from "./opiParser";
import { xml2js, ElementCompact } from "xml-js";
import log from "loglevel";
import { Position, AbsolutePosition } from "../../../types/position";

const BOB_WIDGET_MAPPING: { [key: string]: any } = {
  display: "display",
  textupdate: "readback",
  textentry: "input",
  label: "label",
  group: "grouping",
  rectangle: "shape",
  action_button: "actionbutton" // eslint-disable-line @typescript-eslint/camelcase
};

function bobParseType(props: any): string {
  return BOB_WIDGET_MAPPING[props._attributes.type];
}

export function bobParseNumber(jsonProp: ElementCompact): number | undefined {
  try {
    return Number(jsonProp._text);
  } catch {
    return undefined;
  }
}

function bobParsePosition(props: any): Position {
  return new AbsolutePosition(
    `${bobParseNumber(props.x) ?? 0}px`,
    `${bobParseNumber(props.y) ?? 0}px`,
    `${bobParseNumber(props.width) ?? 300}px`,
    `${bobParseNumber(props.height) ?? 200}px`
  );
}

function bobGetTargetWidget(props: any): React.FC {
  const typeid = bobParseType(props);
  let targetWidget;
  try {
    targetWidget = REGISTERED_WIDGETS[typeid][0];
  } catch {
    targetWidget = REGISTERED_WIDGETS["shape"][0];
  }
  return targetWidget;
}

const BOB_COMPLEX_PARSERS: ComplexParserDict = {
  ...OPI_COMPLEX_PARSERS,
  type: bobParseType,
  position: bobParsePosition
};

export function parseBob(xmlString: string): any {
  // Convert it to a "compact format"
  const compactJSON = xml2js(xmlString, {
    compact: true
  }) as XmlDescription;
  // We don't care about the position of the top-level display widget.
  // We place it at 0,0 within its container.
  compactJSON.display.x = { _text: "0" };
  compactJSON.display.y = { _text: "0" };
  compactJSON.display._attributes.type = "display";
  log.debug(compactJSON);

  return parseWidget(
    compactJSON.display,
    bobGetTargetWidget,
    "widget",
    OPI_SIMPLE_PARSERS,
    BOB_COMPLEX_PARSERS,
    false,
    PATCHERS
  );
}
