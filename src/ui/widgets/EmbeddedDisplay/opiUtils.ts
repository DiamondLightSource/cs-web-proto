// File to hold functions which aid the conversion of opi files
// into our widget format

import log from "loglevel";
import { xml2js, ElementCompact } from "xml-js";

import { WidgetDescription } from "../createComponent";
import { WidgetActions, WRITE_PV } from "../widgetActions";
import { MacroMap } from "../../../redux/csState";
import { Color } from "../../../types/color";
import { Font, FontStyle } from "../../../types/font";
import { GenericProp, Rule } from "../../../types/props";

export const OPI_WIDGET_MAPPING: { [key: string]: string } = {
  "org.csstudio.opibuilder.Display": "display",
  "org.csstudio.opibuilder.widgets.TextUpdate": "readback",
  "org.csstudio.opibuilder.widgets.TextInput": "input",
  "org.csstudio.opibuilder.widgets.Label": "label",
  "org.csstudio.opibuilder.widgets.groupingContainer": "grouping",
  "org.csstudio.opibuilder.widgets.Rectangle": "shape",
  "org.csstudio.opibuilder.widgets.ActionButton": "actionbutton" // eslint-disable-line @typescript-eslint/camelcase
};

export interface XmlDescription {
  _attributes: { [key: string]: string };
  x?: { _text: string };
  y?: { _text: string };
  height?: { _text: string };
  width?: { _text: string };
  widget?: XmlDescription;
  [key: string]: any;
}

interface FunctionSubstitutionInterface {
  [key: string]: (name: string, jsonProp: ElementCompact) => GenericProp;
}

export const opiParseMacros = (
  name: string,
  jsonProp: ElementCompact
): MacroMap => {
  const macroMap: MacroMap = {};
  Object.entries(jsonProp as object).forEach(([key, value]): void => {
    macroMap[key] = value["_text"];
  });
  return macroMap;
};

const toArray = (element?: ElementCompact): ElementCompact[] => {
  let array = [];
  if (Array.isArray(element)) {
    array = element;
  } else if (element) {
    array = [element];
  }
  return array;
};

export const opiParseRules = (
  name: string,
  jsonProp: ElementCompact
): Rule[] => {
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

export interface OpiColor {
  _attributes: { name: string; red: string; blue: string; green: string };
}

export const opiParseColor = (
  name: string,
  jsonProp: ElementCompact
): Color => {
  const color = jsonProp.color as OpiColor;
  try {
    return new Color(
      parseInt(color._attributes.red),
      parseInt(color._attributes.green),
      parseInt(color._attributes.blue)
    );
  } catch (e) {
    log.error(`Could not convert color object ${name}`);
    log.error(color);
    return Color.WHITE;
  }
};

export const opiParsePrecision = (
  name: string,
  jsonProp: ElementCompact
): number => {
  return Number(jsonProp._text);
};

export const opiParseBoolean = (
  name: string,
  jsonProp: ElementCompact
): boolean => {
  const boolText = jsonProp._text;
  if (boolText === "false") {
    return false;
  } else if (boolText === "true") {
    return true;
  } else {
    throw new Error(`Could not parse boolean from ${name}: ${boolText}`);
  }
};

export const opiParseActions = (
  name: string,
  jsonProp: ElementCompact
): WidgetActions => {
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
};

function opiParseFont(name: string, jsonProp: ElementCompact): Font {
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
  return new Font(opiStyles[style], height, fontName);
}

export const OPI_FUNCTION_SUBSTITUTIONS: {
  [key: string]: (name: string, value: any) => GenericProp;
} = {
  macros: opiParseMacros,
  background_color: opiParseColor, // eslint-disable-line @typescript-eslint/camelcase
  foreground_color: opiParseColor, // eslint-disable-line @typescript-eslint/camelcase
  precision: opiParsePrecision,
  visible: opiParseBoolean,
  transparent: opiParseBoolean,
  show_units: opiParseBoolean, // eslint-disable-line @typescript-eslint/camelcase
  actions: opiParseActions,
  font: opiParseFont,
  rules: opiParseRules
};

export const OPI_KEY_SUBSTITUTIONS: { [key: string]: string } = {
  pv_name: "pvName", // eslint-disable-line @typescript-eslint/camelcase
  macros: "macroMap",
  opi_file: "file", // eslint-disable-line @typescript-eslint/camelcase
  background_color: "backgroundColor", // eslint-disable-line @typescript-eslint/camelcase
  foreground_color: "foregroundColor", // eslint-disable-line @typescript-eslint/camelcase
  show_units: "showUnits", // eslint-disable-line @typescript-eslint/camelcase
  // Rename style prop to make sure it isn't used directly to style components.
  style: "opiStyle" // eslint-disable-line @typescript-eslint/camelcase
};

export function opiGetWidgetId(xmlDescription: XmlDescription): string {
  return xmlDescription._attributes.typeId;
}

export function opiSetWidgetId(
  xmlDescription: XmlDescription,
  newId: string
): void {
  xmlDescription._attributes.typeId = newId;
}

export const xmlChildToWidget = (
  xmlChild: XmlDescription,
  idGetter: (xmlChild: XmlDescription) => string,
  widgetIds: { [key: string]: string },
  functionSubstitutions?: FunctionSubstitutionInterface,
  keySubstitutions?: { [key: string]: any }
): WidgetDescription => {
  // Convert a non-root widget from the xml file into a widget
  // It is passed as a JS object now
  // Extract useful props
  const {
    _attributes,
    x,
    y,
    height,
    width,
    widget = [],
    ...remainingProps
  } = xmlChild;

  let type = idGetter(xmlChild);

  // Map the remaining props
  // Checks that there is a substitution map
  const mappedProps: { [key: string]: any } = {};
  if (widgetIds.hasOwnProperty(type)) {
    type = widgetIds[type];
  }

  Object.entries(remainingProps).forEach(([key, value]): void => {
    if (functionSubstitutions && functionSubstitutions[key]) {
      // Use the function substitution
      mappedProps[key] = functionSubstitutions[key](key, value);
    } else {
      // Just extract from text
      mappedProps[key] = value._text;
    }
    if (keySubstitutions && keySubstitutions[key]) {
      mappedProps[keySubstitutions[key]] = mappedProps[key];
      delete mappedProps[key];
    }
  });

  // Make sure widget is an array, otherwise it is seen as an object only
  let widgetList = [];
  if (Array.isArray(widget)) {
    widgetList = widget;
  } else {
    widgetList = [widget];
  }

  // Check that the primary props were defined or use a default value
  /* In opi files, many widgets have default values for height, width and even x and y
  The default values can be different from each other
  This could make life a bit difficult but should be looked at later */
  const outputWidget: WidgetDescription = {
    type: type,
    position: "absolute",
    x: `${(x && x._text) || 0}px`,
    y: `${(y && y._text) || 0}px`,
    height: `${(height && height._text) || 0}px`,
    width: `${(width && width._text) || 0}px`,
    ...mappedProps,
    children: widgetList.map(
      (w: any): WidgetDescription =>
        xmlChildToWidget(
          w as XmlDescription,
          idGetter,
          widgetIds,
          functionSubstitutions,
          keySubstitutions
        )
    )
  };

  return outputWidget;
};

export const xmlToWidgets = (
  xmlString: string,
  idGetter: (xmlChild: XmlDescription) => string,
  idSetter: (xmlDescription: XmlDescription, newId: string) => void,
  widgetIds: { [key: string]: string },
  functionSubstitutions: FunctionSubstitutionInterface,
  keySubstitutions: { [key: string]: any }
): WidgetDescription => {
  // Provide a raw xml file in the opi format for conversion
  // Optionally provide a substition map for keys

  // Convert it to a "compact format"
  const compactJSON = xml2js(xmlString, {
    compact: true
  }) as XmlDescription;

  idSetter(compactJSON.display, "display");

  // We don't care about the position of the top-level display widget.
  // We place it at 0,0 within its container.
  compactJSON.display.x = { _text: "0" };
  compactJSON.display.y = { _text: "0" };
  log.debug(compactJSON);

  return xmlChildToWidget(
    compactJSON.display,
    idGetter,
    widgetIds,
    functionSubstitutions,
    keySubstitutions
  );
};

export function opiToWidgets(opiString: string): WidgetDescription {
  return xmlToWidgets(
    opiString,
    opiGetWidgetId,
    opiSetWidgetId,
    OPI_WIDGET_MAPPING,
    OPI_FUNCTION_SUBSTITUTIONS,
    OPI_KEY_SUBSTITUTIONS
  );
}
