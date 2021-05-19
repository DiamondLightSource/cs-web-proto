import { REGISTERED_WIDGETS } from "../register";
import { Rule } from "../../../types/props";
import { Font, FontStyle } from "../../../types/font";
import { Color } from "../../../types/color";
import { parseWidget, ParserDict, ComplexParserDict } from "./parser";
import { Border, BorderStyle } from "../../../types/border";
import {
  Position,
  AbsolutePosition,
  RelativePosition
} from "../../../types/position";
import { PV } from "../../../types/pv";
import { WidgetDescription } from "../createComponent";

interface JsonBorder {
  style: string;
  color: string;
  width: number;
  radius?: number;
}

interface JsonFont {
  typeface: string;
  size: number;
  style?: string;
  name?: string;
}

function jsonParsePvName(pvName: string, defaultProtocol: string): PV {
  return PV.parse(pvName, defaultProtocol);
}
function jsonParsePosition(props: Record<string, string>): Position {
  if (props.position === "absolute") {
    return new AbsolutePosition(
      props.x,
      props.y,
      props.width,
      props.height,
      props.margin,
      props.padding,
      props.minWidth,
      props.maxWidth,
      props.minHeight
    );
  } else {
    return new RelativePosition(
      props.width,
      props.height,
      props.margin,
      props.padding,
      props.minWidth,
      props.maxWidth,
      props.minHeight
    );
  }
}

function jsonParseColor(jsonColor: string): Color {
  return new Color(jsonColor);
}

function jsonParseBorder(jsonBorder: JsonBorder): Border {
  const styles: { [key: string]: BorderStyle } = {
    none: BorderStyle.None,
    line: BorderStyle.Line,
    dashed: BorderStyle.Dashed,
    dotted: BorderStyle.Dotted,
    groupbox: BorderStyle.GroupBox
  };
  return new Border(
    styles[jsonBorder.style.toLowerCase()],
    jsonParseColor(jsonBorder.color),
    jsonBorder.width,
    jsonBorder.radius
  );
}

function jsonParseFont(jsonFont: JsonFont): Font {
  const styles: { [key: string]: FontStyle } = {
    italic: FontStyle.Italic,
    bold: FontStyle.Bold,
    "bold italic": FontStyle.BoldItalic
  };
  return new Font(
    jsonFont.size,
    jsonFont.style ? styles[jsonFont.style] : undefined,
    jsonFont.typeface
  );
}

function jsonParseRules(jsonRules: Rule[], defaultProtocol: string): Rule[] {
  for (const jsonRule of jsonRules) {
    for (const pv of jsonRule.pvs) {
      pv.pvName = jsonParsePvName(
        // Typing: allow pvName to be a string so that we can use the same type
        // (Rule) for the unparsed as the parsed rule.
        pv.pvName as unknown as string,
        defaultProtocol
      );
    }
    for (const exp of jsonRule.expressions) {
      if (SIMPLE_PARSERS.hasOwnProperty(jsonRule.prop)) {
        exp.convertedValue = SIMPLE_PARSERS[jsonRule.prop][1](exp.value);
      } else {
        exp.convertedValue = exp.value;
      }
    }
  }
  return jsonRules;
}

export const SIMPLE_PARSERS: ParserDict = {
  backgroundColor: ["backgroundColor", jsonParseColor],
  foregroundColor: ["foregroundColor", jsonParseColor],
  font: ["font", jsonParseFont],
  border: ["border", jsonParseBorder]
};

export const COMPLEX_PARSERS: ComplexParserDict = {
  position: jsonParsePosition
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function jsonGetTargetWidget(props: any): React.FC {
  const typeid = props.type;
  let targetWidget;
  try {
    targetWidget = REGISTERED_WIDGETS[typeid][0];
  } catch {
    targetWidget = REGISTERED_WIDGETS["shape"][0];
  }
  return targetWidget;
}

/**
 * Parse a WidgetDescription from objects, typically parsed from JSON.
 * @param jsonString objects in the correct format.
 * @param defaultProtocol default protocol to use for PVs.
 */
export function parseObject(
  object: any, // eslint-disable-line @typescript-eslint/explicit-module-boundary-types
  defaultProtocol: string,
  path?: string
): WidgetDescription {
  const simpleParsers: ParserDict = {
    ...SIMPLE_PARSERS,
    pvName: [
      "pvName",
      (pvName: string): PV => jsonParsePvName(pvName, defaultProtocol)
    ],
    rules: [
      "rules",
      (rules: Rule[]): Rule[] => jsonParseRules(rules, defaultProtocol)
    ]
  };
  return parseWidget(
    object,
    jsonGetTargetWidget,
    "children",
    simpleParsers,
    COMPLEX_PARSERS,
    true,
    [],
    path
  );
}

/**
 * Parse a WidgetDescription from a JSON string.
 * @param jsonString JSON string in the correct format.
 * @param defaultProtocol default protocol to use for PVs.
 */
export function parseJson(
  jsonString: string,
  defaultProtocol: string,
  path: string
): WidgetDescription {
  return parseObject(JSON.parse(jsonString), defaultProtocol, path);
}
