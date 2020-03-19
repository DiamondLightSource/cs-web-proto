import { Rule, Expression } from "../../../types/props";
import { ElementCompact, xml2js } from "xml-js";
import { WidgetActions, WRITE_PV, OPEN_WEBPAGE } from "../widgetActions";
import log from "loglevel";
import { MacroMap } from "../../../redux/csState";
import { Color } from "../../../types/color";
import { FontStyle, Font } from "../../../types/font";
import { Border, BorderStyle } from "../../../types/border";
import {
  Position,
  AbsolutePosition,
  RelativePosition
} from "../../../types/position";
import {
  ComplexParserDict,
  ParserDict,
  parseWidget,
  toArray,
  PatchFunction
} from "./parser";
import { REGISTERED_WIDGETS } from "../register";
import { WidgetDescription } from "../createComponent";
import { PV } from "../../../types/pv";

export interface XmlDescription {
  _attributes: { [key: string]: string };
  x?: { _text: string };
  y?: { _text: string };
  height?: { _text: string };
  width?: { _text: string };
  widget?: XmlDescription;
  [key: string]: any;
}

const OPI_WIDGET_MAPPING: { [key: string]: any } = {
  "org.csstudio.opibuilder.Display": "display",
  "org.csstudio.opibuilder.widgets.TextUpdate": "readback",
  "org.csstudio.opibuilder.widgets.TextInput": "input",
  "org.csstudio.opibuilder.widgets.Label": "label",
  "org.csstudio.opibuilder.widgets.groupingContainer": "grouping",
  "org.csstudio.opibuilder.widgets.Rectangle": "shape",
  "org.csstudio.opibuilder.widgets.ActionButton": "actionbutton",
  "org.csstudio.opibuilder.widgets.MenuButton": "menubutton"
};

function opiParseString(jsonProp: ElementCompact): string {
  if (typeof jsonProp._text === "string") {
    return jsonProp._text;
  } else {
    throw new Error(`Could not parse text from value ${jsonProp._text}`);
  }
}

function opiParseBoolean(jsonProp: ElementCompact): boolean {
  const boolText = jsonProp._text;
  if (boolText === "false") {
    return false;
  } else if (boolText === "true") {
    return true;
  } else {
    throw new Error(`Could not parse boolean from value ${boolText}`);
  }
}

export interface OpiColor {
  _attributes: { name: string; red: string; blue: string; green: string };
}

function opiParseColor(jsonProp: ElementCompact): Color {
  const color = jsonProp.color as OpiColor;
  return new Color(
    parseInt(color._attributes.red),
    parseInt(color._attributes.green),
    parseInt(color._attributes.blue)
  );
}

export function opiParseFont(jsonProp: ElementCompact): Font {
  const opiStyles: { [key: number]: FontStyle } = {
    0: FontStyle.Regular,
    1: FontStyle.Bold,
    2: FontStyle.Italic,
    3: FontStyle.BoldItalic
  };
  let fontAttributes;
  if (jsonProp.hasOwnProperty("fontdata")) {
    fontAttributes = jsonProp["fontdata"]._attributes;
  } else {
    fontAttributes = jsonProp["opifont.name"]._attributes;
  }
  const { fontName, height, style } = fontAttributes;
  return new Font(height, opiStyles[style], fontName);
}

function opiParseMacros(jsonProp: ElementCompact): MacroMap {
  const macroMap: MacroMap = {};
  Object.entries(jsonProp as object).forEach(([key, value]): void => {
    macroMap[key] = value["_text"];
  });
  return macroMap;
}

export function opiParseActions(
  jsonProp: ElementCompact,
  defaultProtocol: string
): WidgetActions {
  const actionsToProcess = toArray(jsonProp.action);

  // Extract information about whether to execute all actions at once
  const executeAsOne = jsonProp._attributes?.execute_as_one === "true";

  // Turn into an array of Actions
  const processedActions: WidgetActions = {
    executeAsOne: executeAsOne,
    actions: []
  };

  actionsToProcess.forEach((action): void => {
    log.debug(action);
    const type = action._attributes?.type;
    try {
      if (type === WRITE_PV) {
        processedActions.actions.push({
          type: WRITE_PV,
          writePvInfo: {
            pvName: opiParsePvName(
              action.pv_name,
              defaultProtocol
            ).qualifiedName(),
            value: action.value._text,
            description:
              (action.description && action.description._text) || undefined
          }
        });
      } else if (type === OPEN_WEBPAGE) {
        processedActions.actions.push({
          type: OPEN_WEBPAGE,
          openWebpageInfo: {
            url: action.hyperlink._text,
            description:
              (action.description && action.description._text) || undefined
          }
        });
      }
    } catch (e) {
      log.error(
        `Could not find action of type ${type} in available actions to convert`
      );
    }
  });

  return processedActions;
}

export const opiParseRules = (
  jsonProp: ElementCompact,
  defaultProtocol: string
): Rule[] => {
  const ruleArray = toArray(jsonProp.rules.rule);
  const rules = ruleArray.map((ruleElement: ElementCompact) => {
    const name = ruleElement._attributes?.name as string;
    const xmlProp = ruleElement._attributes?.prop_id as string;

    const outExp = ruleElement._attributes?.out_exp === "true";
    const pvArray = toArray(ruleElement.pv);
    const pvs = pvArray.map((pv: ElementCompact) => {
      return {
        pvName: opiParsePvName(pv, defaultProtocol),
        trigger: pv._attributes?.trig === "true"
      };
    });
    const expArray = toArray(ruleElement.exp);
    const expressions = expArray.map((expression: ElementCompact) => {
      const value = expression.value;
      return {
        boolExp: expression._attributes?.bool_exp as string,
        value: value
      };
    });
    return {
      name: name,
      prop: xmlProp,
      outExp: outExp,
      expressions: expressions,
      pvs: pvs
    };
  });
  return rules;
};

function opiParseNumber(jsonProp: ElementCompact): number {
  return Number(jsonProp._text);
}

export function opiParsePvName(
  jsonProp: ElementCompact,
  defaultProtocol: string
): PV {
  const rawPv = opiParseString(jsonProp);
  return PV.parse(rawPv, defaultProtocol);
}

function opiParseHorizonalAlignment(jsonProp: ElementCompact): string {
  const alignments: { [key: number]: string } = {
    0: "left",
    1: "center",
    2: "right"
  };
  return alignments[opiParseNumber(jsonProp)];
}

function opiParseBorder(props: any): Border {
  const borderStyles: { [key: number]: BorderStyle } = {
    0: BorderStyle.None
  };
  let style = BorderStyle.None;
  let width = 0;
  let borderColor = Color.BLACK;
  /* Line color can override border for certain widgets. */
  let lineColor;
  try {
    style = borderStyles[opiParseNumber(props.border_style)];
    width = opiParseNumber(props.border_width);
    borderColor = opiParseColor(props.border_color);
    lineColor = opiParseColor(props.line_color);
  } catch {
    // If we can't parse these, assume the defaults.
  }
  const actualColor = width < 2 && lineColor ? lineColor : borderColor;
  const actualStyle = width < 2 && lineColor ? BorderStyle.Line : style;
  return new Border(actualStyle, actualColor, width);
}

function opiParseType(props: any): string {
  const typeId = props._attributes.typeId;
  if (OPI_WIDGET_MAPPING.hasOwnProperty(typeId)) {
    return OPI_WIDGET_MAPPING[typeId];
  } else {
    return typeId;
  }
}

function opiParsePosition(props: any): Position {
  const { x, y, width, height } = props;
  try {
    return new AbsolutePosition(
      `${opiParseNumber(x)}px`,
      `${opiParseNumber(y)}px`,
      `${opiParseNumber(width)}px`,
      `${opiParseNumber(height)}px`
    );
  } catch (error) {
    const msg = `Failed to parse position (${x},${y},${width},${height}): ${error}`;
    throw new Error(msg);
  }
}

function opiGetTargetWidget(props: any): React.FC {
  const typeid = opiParseType(props);
  let targetWidget;
  try {
    targetWidget = REGISTERED_WIDGETS[typeid][0];
  } catch {
    targetWidget = REGISTERED_WIDGETS["shape"][0];
  }
  return targetWidget;
}

export const OPI_SIMPLE_PARSERS: ParserDict = {
  text: ["text", opiParseString],
  name: ["name", opiParseString],
  textAlign: ["horizontal_alignment", opiParseHorizonalAlignment],
  backgroundColor: ["background_color", opiParseColor],
  foregroundColor: ["foreground_color", opiParseColor],
  precision: ["precision", opiParseNumber],
  visible: ["visible", opiParseBoolean],
  showUnits: ["show_units", opiParseBoolean],
  transparent: ["transparent", opiParseBoolean],
  font: ["font", opiParseFont],
  macroMap: ["macros", opiParseMacros]
};

export const OPI_COMPLEX_PARSERS: ComplexParserDict = {
  type: opiParseType,
  position: opiParsePosition,
  border: opiParseBorder
};

function opiPatchRules(widgetDescription: WidgetDescription): void {
  /* Re-index simple parsers so we can find the correct one
     for the opi prop. */
  const opiPropParsers: ParserDict = {};
  Object.entries(OPI_SIMPLE_PARSERS).forEach(([jsonProp, vals]) => {
    opiPropParsers[vals[0]] = [jsonProp, vals[1]];
  });
  /* Patch up the rules by converting the prop to our name
     and converting the value to the correct type. */
  widgetDescription.rules?.forEach((rule: Rule) => {
    if (opiPropParsers.hasOwnProperty(rule.prop)) {
      const [newPropName, parser] = opiPropParsers[rule.prop];
      rule.prop = newPropName;
      rule.expressions.forEach((expression: Expression) => {
        const convertedValue = parser(expression.value);
        expression.convertedValue = convertedValue;
      });
    }
  });
}

export const OPI_PATCHERS: PatchFunction[] = [opiPatchRules];

export function parseOpi(xmlString: string, defaultProtocol: string): any {
  // Convert it to a "compact format"
  const compactJSON = xml2js(xmlString, {
    compact: true
  }) as XmlDescription;
  // We don't care about the position of the top-level display widget.
  // We place it at 0,0 within its container.
  compactJSON.display.x = { _text: "0" };
  compactJSON.display.y = { _text: "0" };
  log.debug(compactJSON);

  const simpleParsers: ParserDict = {
    ...OPI_SIMPLE_PARSERS,
    pvName: [
      "pv_name",
      (pvName: ElementCompact): PV => opiParsePvName(pvName, defaultProtocol)
    ],
    actions: [
      "actions",
      (actions: ElementCompact): WidgetActions =>
        opiParseActions(actions, defaultProtocol)
    ]
  };

  const complexParsers = {
    ...OPI_COMPLEX_PARSERS,
    rules: (rules: Rule[]): Rule[] => opiParseRules(rules, defaultProtocol)
  };

  log.debug(compactJSON.display);

  const displayWidget = parseWidget(
    compactJSON.display,
    opiGetTargetWidget,
    "widget",
    simpleParsers,
    complexParsers,
    false,
    OPI_PATCHERS
  );

  displayWidget.position = new RelativePosition(
    displayWidget.position.width,
    displayWidget.position.height
  );
  return displayWidget;
}
