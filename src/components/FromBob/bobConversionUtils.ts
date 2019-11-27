// File to hold functions which aid the conversion of bob files
//  into our widget format

import log from "loglevel";
import convert from "xml-js";

import { WidgetDescription } from "../Positioning/positioning";
import { WidgetActions, WRITE_PV } from "../../widgetActions";

interface BobDescription {
  [key: string]: any;
}

export interface UnknownPropsObject {
  [key: string]: any;
}

interface FunctionSubstitutionInterface {
  [key: string]: (
    inputProps: UnknownPropsObject,
    ouptutProps: UnknownPropsObject
  ) => void;
}

export const bobMacrosToMacroMap = (
  inputProps: UnknownPropsObject,
  outputProps: UnknownPropsObject
): void => {
  // Start with blank object
  if (inputProps.macros) {
    outputProps.macroMap = {};
    Object.entries(inputProps.macros as object).forEach(
      ([key, value]): void => {
        outputProps.macroMap[key] = value["_text"];
      }
    );
  }
};

export interface BobColor {
  _attributes: { name: string; red: string; blue: string; green: string };
}

export const bobColorsToColor = (color: BobColor): string => {
  try {
    return `rgb(${color._attributes.red}, ${color._attributes.green}, ${color._attributes.blue})`;
  } catch (e) {
    log.error(`Could not convert color object`);
    log.error(color);
    return "";
  }
};

export const bobBackgroundColor = (
  inputProps: UnknownPropsObject,
  outputProps: UnknownPropsObject
): void => {
  outputProps.backgroundColor = bobColorsToColor(
    inputProps.background_color.color
  );
};

export const bobForegroundColor = (
  inputProps: UnknownPropsObject,
  outputProps: UnknownPropsObject
): void => {
  outputProps.color = bobColorsToColor(inputProps.foreground_color.color);
};

export const bobPrecisionToNumber = (
  inputProps: UnknownPropsObject,
  outputProps: UnknownPropsObject
): void => {
  try {
    outputProps.precision = Number(inputProps.precision._text);
  } catch (e) {
    log.error(
      `Could not convert precision of ${inputProps.precision} to a number`
    );
  }
};

export const bobVisibleToBoolen = (
  inputProps: UnknownPropsObject,
  outputProps: UnknownPropsObject
): void => {
  try {
    let visible = inputProps.visible._text;
    if (visible === "true") {
      outputProps.visible = true;
    } else if (visible === "false") {
      outputProps.visible = false;
    }
  } catch (e) {
    log.error(
      `Could not convert visible property ${inputProps.visible} to a number`
    );
  }
};

export const bobAvoidStyleProp = (
  inputProps: UnknownPropsObject,
  outputProps: UnknownPropsObject
): void => {};

export const bobActionToAction = (
  bobAction: UnknownPropsObject
): WidgetActions => {
  let actionsToProcess: any[] = [];
  if (Array.isArray(bobAction)) {
    actionsToProcess = bobAction;
  } else {
    actionsToProcess = [bobAction];
  }

  // Object of available actions
  const availableActions: { [key: string]: any } = {
    write_pv: WRITE_PV, // eslint-disable-line @typescript-eslint/camelcase
    WRITE_PV: WRITE_PV
  };

  // Turn into an array of Actions
  let processedActions: WidgetActions = { executeAsOne: false, actions: [] };

  actionsToProcess.forEach((action): void => {
    log.debug(action);
    let type: string = availableActions[action._attributes.type];
    if (type === WRITE_PV) {
      processedActions.actions.push({
        type: WRITE_PV,
        pvName: action.pv_name._text,
        value: action.value._text,
        description: action.description._text
      });
    }
  });

  return processedActions;
};

export const bobHandleActions = (
  inputProps: UnknownPropsObject,
  outputProps: UnknownPropsObject
): void => {
  if (inputProps.actions.action) {
    outputProps.actions = bobActionToAction(inputProps.actions.action);
  }
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
  Object.entries(remainingProps as UnknownPropsObject).forEach(
    ([key, value]): void => {
      if (functionSubstitutions && functionSubstitutions[key]) {
        // Use the function substitution
        functionSubstitutions[key](remainingProps, mappedProps);
      } else if (keySubstitutions && keySubstitutions[key]) {
        // Just substitute the key and extract from _text
        mappedProps[keySubstitutions[key]] = value._text;
      } else {
        // Just extract from text
        mappedProps[key] = value._text;
      }
    }
  );

  // Make sure widget is an array, otherwise it is seen as an object only
  let widgetList = [];
  if (Array.isArray(widget)) {
    widgetList = widget;
  } else {
    widgetList = [widget];
  }

  // Check that the primary props were defined or use a default value
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
    [key: string]: (inputProps: object, ouptutProps: object) => void;
  },
  keySubstitutions?: { [key: string]: any }
): WidgetDescription => {
  // Provide a raw xml file in the bob format for conversion
  // Optionally provide a substition map for keys

  // Convert it to a "compact format"
  const compactJSON = convert.xml2js(bobInputString, {
    compact: true
  }) as BobDescription;

  log.debug(compactJSON);

  // Add display to top of JSON to be processed
  // Assumes top level widget is always display - valid for XML files
  compactJSON.display._attributes = { type: "display" };

  return bobChildToWidgetChild(
    compactJSON.display,
    functionSubstitutions,
    keySubstitutions
  );
};
