import { WidgetDescription } from "../createComponent";
import { GenericProp, Rule, Expression } from "../../../types/props";
import { ElementCompact } from "xml-js";
import { widgets } from "../register";
import { WidgetActions, WRITE_PV } from "../widgetActions";
import log from "loglevel";
import { MacroMap } from "../../../redux/csState";
import { Color } from "../../../types/color";
import { FontStyle, Font } from "../../../types/font";
import { Label } from "../Label/label";
import { StringOrNumProp } from "../propTypes";
import { Border, BorderStyle } from "../../../types/border";

const OPI_WIDGET_MAPPING: { [key: string]: any } = {
  "org.csstudio.opibuilder.Display": "display",
  "org.csstudio.opibuilder.widgets.TextUpdate": "readback",
  "org.csstudio.opibuilder.widgets.TextInput": "input",
  "org.csstudio.opibuilder.widgets.Label": "label",
  "org.csstudio.opibuilder.widgets.groupingContainer": "grouping",
  "org.csstudio.opibuilder.widgets.Rectangle": "shape",
  "org.csstudio.opibuilder.widgets.ActionButton": "actionbutton" // eslint-disable-line @typescript-eslint/camelcase
};

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
  console.log("opiParseFont");
  console.log(jsonProp);
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

const toArray = (element?: ElementCompact): ElementCompact[] => {
  let array = [];
  if (Array.isArray(element)) {
    array = element;
  } else if (element) {
    array = [element];
  }
  return array;
};

function opiParseActions(jsonProp: ElementCompact): WidgetActions {
  let actionsToProcess: any[] = [];
  if (Array.isArray(jsonProp.action)) {
    actionsToProcess = jsonProp.action;
  } else if (jsonProp.action !== undefined) {
    actionsToProcess = [jsonProp.action];
  }

  // Object of available actions
  const availableActions: { [key: string]: any } = {
    write_pv: WRITE_PV, // eslint-disable-line @typescript-eslint/camelcase
    WRITE_PV: WRITE_PV
  };

  // Extract information about whether to execute all actions at once
  const executeAsOne =
    (jsonProp._attributes !== undefined &&
      jsonProp._attributes.execute_as_one) === "true"
      ? true
      : false;

  // Turn into an array of Actions
  const processedActions: WidgetActions = {
    executeAsOne: executeAsOne,
    actions: []
  };

  actionsToProcess.forEach((action): void => {
    log.debug(action);
    try {
      const type: string = availableActions[action._attributes.type];
      if (type === WRITE_PV) {
        // Not all actions have descriptions so ret
        processedActions.actions.push({
          type: WRITE_PV,
          writePvInfo: {
            pvName: action.pv_name._text,
            value: action.value._text,
            description:
              (action.description && action.description._text) || undefined
          }
        });
      }
    } catch (e) {
      log.error(
        `Could not find action ${action._attributes.type} in available actions to convert`
      );
    }
  });

  return processedActions;
}

export const opiParseRules = (jsonProp: ElementCompact): Rule[] => {
  const ruleArray = toArray(jsonProp.rules.rule);
  const rules = ruleArray.map((ruleElement: ElementCompact) => {
    const name = ruleElement._attributes?.name as string;
    const xmlProp = ruleElement._attributes?.prop_id as string;

    const outExp = ruleElement._attributes?.out_exp === "true";
    const pvArray = toArray(ruleElement.pv);
    const pvs = pvArray.map((pv: ElementCompact) => {
      return {
        pvName: pv._text as string,
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

function opiParseBorder(props: any): Border {
  const borderStyles: { [key: number]: BorderStyle } = {
    0: BorderStyle.None
  };
  const style = borderStyles[opiParseNumber(props.border_style)];
  const width = opiParseNumber(props.border_width);
  const color = opiParseColor(props.border_color);
  return new Border(style, color, width);
}

function opiParseHeight(props: any): number {
  return opiParseNumber(props.height);
}
function opiParseWidth(props: any): number {
  return opiParseNumber(props.width);
}
function opiParseX(props: any): number {
  return opiParseNumber(props.x);
}
function opiParseY(props: any): number {
  return opiParseNumber(props.y);
}
function opiParseForegroundColor(props: any): Color {
  return opiParseColor(props.foreground_color);
}
function opiParseBackgroundColor(props: any): Color {
  return opiParseColor(props.background_color);
}
function opiParsePrecision(props: any): number {
  return opiParseNumber(props.precision);
}
function opiParseVisible(props: any): boolean {
  return opiParseBoolean(props.visible);
}
function opiParseShowUnits(props: any): boolean {
  return opiParseBoolean(props.show_units);
}

type DEFAULT_PARSERS = {
  [key: string]: (value: any) => GenericProp;
};

export const OPI_DEFAULT_PARSERS: DEFAULT_PARSERS = {
  height: opiParseHeight,
  width: opiParseWidth,
  x: opiParseX,
  y: opiParseY,
  macros: opiParseMacros,
  backgroundColor: opiParseBackgroundColor,
  foregroundColor: opiParseForegroundColor,
  precision: opiParsePrecision,
  visible: opiParseVisible,
  transparent: opiParseVisible,
  showUnits: opiParseShowUnits,
  actions: opiParseActions,
  font: opiParseFont,
  rules: opiParseRules,
  border: opiParseBorder
};

/* Take an object representing a widget and return our widget description. */
export function genericParser(
  widget: any,
  targetWidget: any,
  defaultParsers: DEFAULT_PARSERS
): WidgetDescription {
  const newProps: any = { type: targetWidget };
  const allProps = {
    x: StringOrNumProp,
    y: StringOrNumProp,
    height: StringOrNumProp,
    width: StringOrNumProp,
    /* Warning for using prop-types at runtime here. */
    ...targetWidget.propTypes
  };
  for (const prop of Object.keys(allProps)) {
    if (defaultParsers.hasOwnProperty(prop)) {
      console.log(`default parser for ${prop}`);
      const propParser = defaultParsers[prop];
      try {
        newProps[prop] = propParser(widget);
      } catch (e) {
        log.error(`Could not convert prop ${prop}:`);
        log.error(widget[prop]);
        log.error(e);
      }
    }
  }
  /* convert rule values? */
  newProps.rules?.forEach((rule: Rule) => {
    rule.expressions.forEach((expression: Expression) => {
      /* We need to map the prop? */
      if (defaultParsers.hasOwnProperty(rule.prop)) {
        const convertedValue = defaultParsers[rule.prop](widget);
        expression.convertedValue = convertedValue;
      }
      /* We need the type of the prop in order to parse */
    });
  });
  return newProps;
}

export function parseOpiWidget(widget: any): any {
  const props = widget.widget;
  console.log("opiParseType");
  const typeid = props._attributes.typeId;
  let targetWidget;
  /* This mapping hard-coded? */
  if (OPI_WIDGET_MAPPING.hasOwnProperty(typeid)) {
    targetWidget = widgets[OPI_WIDGET_MAPPING[typeid]][0];
  } else {
    /* What should we do in case of failure? */
    return Label;
  }
  return genericParser(props, targetWidget, OPI_DEFAULT_PARSERS);
}
