import { WidgetDescription } from "../createComponent";
import { Color } from "../../../types/color";
import { Font, FontStyle } from "../../../types/font";
import { Rule } from "../../../types/rules";
import { GenericProp } from "../../../types/props";
import { Border, BorderStyle } from "../../../types/border";

export interface JsonDescription {
  type: string;
  x: string;
  y: string;
  height: string;
  width: string;
  children: JsonDescription[];
  [key: string]: any;
}
function jsonParseColor(name: string, jsonColor: string): Color {
  return Color.parse(jsonColor);
}

function jsonParseBorder(name: string, jsonBorder: any): Border {
  const styles: { [key: string]: BorderStyle } = {
    none: BorderStyle.None,
    line: BorderStyle.Line,
    groupbox: BorderStyle.GroupBox
  };
  return new Border(
    styles[jsonBorder.style?.toLowerCase()],
    jsonParseColor("border color", jsonBorder.color),
    jsonBorder.width
  );
}

function jsonParseFont(name: string, jsonFont: any): Font {
  const styles: { [key: string]: FontStyle } = {
    italic: FontStyle.Italic,
    bold: FontStyle.Bold,
    "bold italic": FontStyle.BoldItalic
  };
  return new Font(
    styles[jsonFont.style?.toLowerCase()],
    jsonFont.size,
    jsonFont.typeface
  );
}

function jsonParseRules(name: string, jsonRules: Rule[]): Rule[] {
  for (const jsonRule of jsonRules) {
    for (const exp of jsonRule.expressions) {
      if (JSON_FUNCTION_SUBSTITUTIONS.hasOwnProperty(jsonRule.prop)) {
        exp.convertedValue = JSON_FUNCTION_SUBSTITUTIONS[jsonRule.prop](
          jsonRule.prop,
          exp.value
        );
      } else {
        exp.convertedValue = exp.value;
      }
    }
  }
  return jsonRules;
}

export const JSON_FUNCTION_SUBSTITUTIONS: {
  [key: string]: (name: string, value: any) => GenericProp;
} = {
  color: jsonParseColor,
  backgroundColor: jsonParseColor,
  font: jsonParseFont,
  rules: jsonParseRules,
  border: jsonParseBorder
};

function jsonChildToWidget(widget: JsonDescription): WidgetDescription {
  const { type, position, x, y, height, width, children = [] } = widget;
  const mappedProps: { [key: string]: any } = {};
  Object.entries(widget).forEach(([key, value]): void => {
    if (JSON_FUNCTION_SUBSTITUTIONS.hasOwnProperty(key)) {
      value = JSON_FUNCTION_SUBSTITUTIONS[key]?.(key, value);
    }
    mappedProps[key] = value;
  });

  return {
    type: type,
    position: position,
    x: x ? `${x}px` : undefined,
    y: y ? `${y}px` : undefined,
    height: height ? `${height}px` : undefined,
    width: width ? `${width}px` : undefined,
    ...mappedProps,
    children: children.map((child: any) => jsonChildToWidget(child))
  };
}
export function jsonToWidgets(jsonString: string): WidgetDescription {
  return jsonChildToWidget(JSON.parse(jsonString));
}
