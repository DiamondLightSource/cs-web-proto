import { WidgetDescription } from "../createComponent";
import { GenericProp, Rule } from "../../../types/props";
import { ElementCompact } from "xml-js";
import { widgets } from "../register";
import { WidgetActions, WRITE_PV } from "../widgetActions";
import log from "loglevel";
import { MacroMap } from "../../../redux/csState";
import { Color } from "../../../types/color";
import { FontStyle, Font } from "../../../types/font";
import { Label } from "../Label/label";

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
  const ruleArray = toArray(jsonProp.rule);
  const rules = ruleArray.map((ruleElement: ElementCompact) => {
    const name = ruleElement._attributes?.name as string;
    const xmlProp = ruleElement._attributes?.prop_id as string;
    // Change the prop from the rule to the prop used in our JSON format.
    let jsonProp = xmlProp;
    if (OPI_KEY_SUBSTITUTIONS.hasOwnProperty(xmlProp)) {
      jsonProp = OPI_KEY_SUBSTITUTIONS[xmlProp];
    }

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
      let convertedValue = value;
      if (OPI_FUNCTION_SUBSTITUTIONS.hasOwnProperty(xmlProp)) {
        convertedValue = OPI_FUNCTION_SUBSTITUTIONS[xmlProp](xmlProp, value);
      }

      return {
        boolExp: expression._attributes?.bool_exp as string,
        value: value,
        convertedValue: convertedValue
      };
    });
    return {
      name: name,
      prop: jsonProp,
      outExp: outExp,
      expressions: expressions,
      pvs: pvs
    };
  });
  return rules;
};

function opiParseType(value: ElementCompact): GenericProp {
  console.log("opiParseType");
  const typeid = value.typeId;
  /* This mapping hard-coded? */
  if (OPI_WIDGET_MAPPING.hasOwnProperty(typeid)) {
    return widgets[OPI_WIDGET_MAPPING[typeid]][0];
  } else {
    return value.typeId;
  }
}

function opiParseNumber(jsonProp: ElementCompact): number {
  return Number(jsonProp._text);
}

type DEFAULT_PARSERS = {
  [key: string]: [string, (value: any) => GenericProp];
};

export const OPI_DEFAULT_PARSERS: DEFAULT_PARSERS = {
  height: ["height", opiParseNumber],
  width: ["width", opiParseNumber],
  x: ["x", opiParseNumber],
  y: ["y", opiParseNumber],
  macros: ["macros", opiParseMacros],
  background_color: ["backgroundColor", opiParseColor], // eslint-disable-line @typescript-eslint/camelcase
  foreground_color: ["foregroundColor", opiParseColor], // eslint-disable-line @typescript-eslint/camelcase
  precision: ["precision", opiParseNumber],
  visible: ["visible", opiParseBoolean],
  transparent: ["transparent", opiParseBoolean],
  show_units: ["showUnits", opiParseBoolean], // eslint-disable-line @typescript-eslint/camelcase
  actions: ["actions", opiParseActions],
  font: ["font", opiParseFont],
  rules: ["rules", opiParseRules],
  _attributes: ["type", opiParseType]
};

/* Take an object representing a widget and return our widget description. */
export function genericParser(
  widget: any,
  targetWidget: any,
  widgetMap: { [key: string]: string },
  defaultParsers: DEFAULT_PARSERS
): WidgetDescription {
  const newProps: any = {};
  for (const prop of Object.keys(widget)) {
    if (defaultParsers.hasOwnProperty(prop)) {
      console.log(`default parser for ${prop}`);
      const [propName, propParser] = defaultParsers[prop];
      try {
        newProps[propName] = propParser(widget[prop]);
      } catch (e) {
        log.error(`Could not convert prop ${prop}:`);
        log.error(widget[prop]);
        log.error(e);
      }
    }
  }
  return newProps;
}

export function opiParser(widget: any): any {
  const props = widget.widget;
  console.log("opiParseType");
  const typeid = props._attributes.typeId;
  let targetWidget;
  /* This mapping hard-coded? */
  if (OPI_WIDGET_MAPPING.hasOwnProperty(typeid)) {
    targetWidget = widgets[OPI_WIDGET_MAPPING[typeid]][0];
  } else {
    return Label;
  }
  return genericParser(
    props,
    targetWidget,
    OPI_WIDGET_MAPPING,
    OPI_DEFAULT_PARSERS
  );
}
