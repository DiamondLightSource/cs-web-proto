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

interface JsonBorder {
  style: string;
  color: string;
  width: number;
}

interface JsonFont {
  typeface: string;
  size: number;
  style?: string;
  name?: string;
}

function jsonParsePosition(props: any): Position {
  if (props.position === "absolute") {
    return new AbsolutePosition(
      props.x,
      props.y,
      props.width,
      props.height,
      props.margin,
      props.padding,
      props.minWidth,
      props.maxWidth
    );
  } else {
    return new RelativePosition(
      props.width,
      props.height,
      props.margin,
      props.padding,
      props.minWidth,
      props.maxWidth
    );
  }
}

function jsonParseColor(jsonColor: string): Color {
  return Color.parse(jsonColor);
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
    jsonBorder.width
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

function jsonParseRules(jsonRules: Rule[]): Rule[] {
  for (const jsonRule of jsonRules) {
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
  rules: ["rules", jsonParseRules],
  border: ["border", jsonParseBorder]
};

export const COMPLEX_PARSERS: ComplexParserDict = {
  position: jsonParsePosition
};

function jsonGetTargetWidget(props: any): React.FC {
  const typeid = props.type;
  console.log("jgtw");
  console.log(typeid);
  let targetWidget;
  try {
    targetWidget = REGISTERED_WIDGETS[typeid][0];
  } catch {
    targetWidget = REGISTERED_WIDGETS["shape"][0];
  }
  return targetWidget;
}

export function parseJson(jsonString: string): any {
  return parseWidget(
    JSON.parse(jsonString),
    jsonGetTargetWidget,
    "children",
    SIMPLE_PARSERS,
    COMPLEX_PARSERS,
    true,
    []
  );
}
