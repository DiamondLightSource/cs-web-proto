import { REGISTERED_WIDGETS } from "../register";
import { ComplexParserDict, parseWidget, ParserDict } from "./parser";
import {
  XmlDescription,
  OPI_COMPLEX_PARSERS,
  PATCHERS,
  OPI_SIMPLE_PARSERS,
  opiParseRules,
  opiParsePvName,
  opiParseActions
} from "./opiParser";
import { xml2js, ElementCompact } from "xml-js";
import log from "loglevel";
import { Position, AbsolutePosition } from "../../../types/position";
import { PV } from "../../../types/pv";
import { Rule } from "../../../types/props";
import { WidgetActions } from "../widgetActions";

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

export function parseBob(xmlString: string, defaultProtocol: string): any {
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

  const simpleParsers: ParserDict = {
    ...OPI_SIMPLE_PARSERS,
    pvName: [
      "pvName",
      (pvName: ElementCompact): PV => opiParsePvName(pvName, defaultProtocol)
    ],
    rules: [
      "rules",
      (rules: Rule[]): Rule[] => opiParseRules(rules, defaultProtocol)
    ],
    actions: [
      "actions",
      (actions: ElementCompact): WidgetActions =>
        opiParseActions(actions, defaultProtocol)
    ]
  };

  const complexParsers = {
    ...BOB_COMPLEX_PARSERS,
    rules: (rules: Rule[]): Rule[] => opiParseRules(rules, defaultProtocol)
  };

  return parseWidget(
    compactJSON.display,
    bobGetTargetWidget,
    "widget",
    simpleParsers,
    complexParsers,
    false,
    PATCHERS
  );
}
