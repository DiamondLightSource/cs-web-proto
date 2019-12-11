// File to hold functions which aid the conversion of bob files
//  into our widget format

import log from "loglevel";
import convert from "xml-js";

import { WidgetDescription } from "../Positioning/positioning";
import { WidgetActions, WRITE_PV } from "../../widgetActions";
import { MacroMap } from "../../redux/csState";

type GenericProp = string | boolean | number | MacroMap | WidgetActions;

interface BobDescription {
  _attributes: { [key: string]: string };
  x?: { _text: string };
  y?: { _text: string };
  height?: { _text: string };
  width?: { _text: string };
  widget?: BobDescription;
  [key: string]: any;
}

interface FunctionSubstitutionInterface {
  [key: string]: (
    name: string,
    jsonProp: convert.ElementCompact
  ) => GenericProp;
}

export const bobParseMacros = (
  name: string,
  jsonProp: convert.ElementCompact
): MacroMap => {
  const macroMap: MacroMap = {};
  Object.entries(jsonProp as object).forEach(([key, value]): void => {
    macroMap[key] = value["_text"];
  });
  return macroMap;
};

export interface BobColor {
  _attributes: { name: string; red: string; blue: string; green: string };
}

export const bobParseColor = (
  name: string,
  jsonProp: convert.ElementCompact
): string => {
  const color = jsonProp.color as BobColor;
  try {
    return `rgb(${color._attributes.red}, ${color._attributes.green}, ${color._attributes.blue})`;
  } catch (e) {
    log.error(`Could not convert color object ${name}`);
    log.error(color);
    return "";
  }
};

export const bobParsePrecision = (
  name: string,
  jsonProp: convert.ElementCompact
): number => {
  return Number(jsonProp._text);
};

export const bobParseBoolean = (
  name: string,
  jsonProp: convert.ElementCompact
): boolean => {
  let boolText = jsonProp._text;
  if (boolText === "false") {
    return false;
  } else if (boolText === "true") {
    return true;
  } else {
    throw new Error(`Could not parse boolean from ${name}: ${boolText}`);
  }
};

export const bobParseActions = (
  name: string,
  jsonProp: convert.ElementCompact
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
  let processedActions: WidgetActions = {
    executeAsOne: executeAsOne,
    actions: []
  };

  actionsToProcess.forEach((action): void => {
    log.debug(action);
    try {
      let type: string = availableActions[action._attributes.type];
      if (type === WRITE_PV) {
        processedActions.actions.push({
          type: WRITE_PV,
          pvName: action.pv_name._text,
          value: action.value._text
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

export const bobChildToWidgetChild = (
  bobChild: BobDescription,
  functionSubstitutions?: FunctionSubstitutionInterface,
  keySubstitutions?: { [key: string]: any }
): WidgetDescription => {
  // Convert a non-root widget from the bob file into a widget
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
  } = bobChild;

  // Map the remaining props
  // Checks that there is a substitution map
  let mappedProps: { [key: string]: any } = {};
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
  /* In bob files, many widgets have default values for height, width and even x and y
  The default values can be different from each other
  This could make life a bit difficult but should be looked at later */
  let outputWidget: WidgetDescription = {
    type: _attributes.type || _attributes.typeId,
    position: "absolute",
    x: `${(x && x._text) || 0}px`,
    y: `${(y && y._text) || 0}px`,
    height: `${(height && height._text) || 0}px`,
    width: `${(width && width._text) || 0}px`,
    ...mappedProps,
    children: widgetList.map(
      (w: any): WidgetDescription =>
        bobChildToWidgetChild(
          w as BobDescription,
          functionSubstitutions,
          keySubstitutions
        )
    )
  };

  return outputWidget;
};

export const convertBobToWidgetDescription = (
  bobInputString: string,
  functionSubstitutions?: {
    [key: string]: (name: string, inputProp: object) => GenericProp;
  },
  keySubstitutions?: { [key: string]: string }
): WidgetDescription => {
  // Provide a raw xml file in the bob format for conversion
  // Optionally provide a substition map for keys

  // Convert it to a "compact format"
  const compactJSON = convert.xml2js(bobInputString, {
    compact: true
  }) as BobDescription;

  // Add display to top of JSON to be processed
  // Assumes top level widget is always display - valid for XML files
  compactJSON.display._attributes = { type: "display" };
  // We don't care about the position of the top-level display widget.
  // We place it at 0,0 within its container.
  compactJSON.display.x = { _text: "0" };
  compactJSON.display.y = { _text: "0" };
  log.debug(compactJSON);

  return bobChildToWidgetChild(
    compactJSON.display,
    functionSubstitutions,
    keySubstitutions
  );
};
