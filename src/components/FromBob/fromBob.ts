/* Provide the same component as fromJson but converting bob files and
providing a useful widget dictionary */

import { useState } from "react";
import PropTypes from "prop-types";
import log from "loglevel";
import convert from "xml-js";

import {
  WidgetDescription,
  widgetDescriptionToComponent
} from "../Positioning/positioning";
import { Label } from "../Label/label";
import { Readback } from "../Readback/readback";
import { Input } from "../Input/input";
import { Display } from "../Display/display";
import { Shape } from "../Shape/shape";
import { GroupingContainer } from "../GroupingContainer/groupingContainer";
import { WidgetPropType, InferWidgetProps } from "../Widget/widget";
import { Actions, WRITE_PV } from "../../actions";

interface BobDescription {
  [key: string]: any;
}

interface UnknownPropsObject {
  [key: string]: any;
}

interface FunctionSubstitutionInterface {
  [key: string]: (
    inputProps: UnknownPropsObject,
    ouptutProps: UnknownPropsObject
  ) => void;
}

const bobMacrosToMacroMap = (
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

const bobColorsToColor = (color: {
  _attributes: { name: string; red: string; blue: string; green: string };
}): string => {
  try {
    return `rgb( ${color._attributes.red},  ${color._attributes.green}, ${color._attributes.blue})`;
  } catch (e) {
    log.error(`Could not convert color object`);
    log.error(color);
    return "";
  }
};

const bobBackgroundColor = (
  inputProps: UnknownPropsObject,
  outputProps: UnknownPropsObject
): void => {
  outputProps.backgroundColor = bobColorsToColor(
    inputProps.background_color.color
  );
};

const bobForegroundColor = (
  inputProps: UnknownPropsObject,
  outputProps: UnknownPropsObject
): void => {
  outputProps.color = bobColorsToColor(inputProps.foreground_color.color);
};

const bobPrecisionToNumber = (
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

const bobVisibleToBoolen = (
  inputProps: UnknownPropsObject,
  outputProps: UnknownPropsObject
): void => {
  try {
    outputProps.visible = Boolean(inputProps.visible._text);
  } catch (e) {
    log.error(
      `Could not convert visible property ${inputProps.visible} to a number`
    );
  }
};

const bobAvoidStyleProp = (
  inputProps: UnknownPropsObject,
  outputProps: UnknownPropsObject
): void => {};

const bobActionToAction = (bobAction: UnknownPropsObject): Actions => {
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
  let processedActions: Actions = { executeAsOne: false, actions: [] };

  actionsToProcess.forEach((action): void => {
    log.debug(action);
    let type: string = availableActions[action._attributes.type];
    if (type == WRITE_PV) {
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

const bobHandleActions = (
  inputProps: UnknownPropsObject,
  outputProps: UnknownPropsObject
): void => {
  if (inputProps.actions.action) {
    outputProps.actions = bobActionToAction(inputProps.actions.action);
  }
};

const bobChildToWidgetChild = (
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

  // Check that the primary props were defined or use a default value
  let outputWidget: WidgetDescription = {
    type: _attributes.type || _attributes.typeId,
    position: "absolute",
    x: `${(x && x._text) || 0}px`,
    y: `${(y && y._text) || 0}px`,
    height: `${(height && height._text) || 0}px`,
    width: `${(width && width._text) || 0}px`,
    ...mappedProps,
    children: widget.map(
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

  console.log(compactJSON);

  // Add display to top of JSON to be processed
  // Assumes top level widget is always display - valid for XML files
  compactJSON.display._attributes = { type: "display" };

  return bobChildToWidgetChild(
    compactJSON.display,
    functionSubstitutions,
    keySubstitutions
  );
};

const EMPTY_WIDGET: WidgetDescription = {
  type: "empty",
  position: "absolute",
  x: 0,
  y: 0,
  width: 0,
  height: 0
};

const ERROR_WIDGET: WidgetDescription = {
  type: "label",
  position: "relative",
  fontWeight: "bold",
  backgroundColor: "red",
  text: "Error"
};

const WidgetFromBobProps = {
  file: PropTypes.string.isRequired,
  ...WidgetPropType
};

export const WidgetFromBob = (
  props: InferWidgetProps<typeof WidgetFromBobProps>
): JSX.Element => {
  const [bob, setBob] = useState<string>("");

  // Extract props
  let { file, macroMap } = props;

  if (bob === "") {
    fetch(file)
      .then(
        (response): Promise<any> => {
          return response.text();
        }
      )
      .then((bob): void => {
        setBob(bob);
      });
  }
  const widgetDict = {
    textupdate: Readback,
    "org.csstudio.opibuilder.widgets.TextUpdate": Readback,
    textentry: Input,
    "org.csstudio.opibuilder.widgets.TextInput": Input,
    label: Label,
    "org.csstudio.opibuilder.widgets.Label": Label,
    group: GroupingContainer,
    "org.csstudio.opibuilder.widgets.groupingContainer": GroupingContainer,
    display: Display,
    rectangle: Shape,
    "org.csstudio.opibuilder.widgets.Rectangle": Shape,
    empty: Display,
    widgetFromBob: WidgetFromBob
  };

  let component: JSX.Element;
  try {
    let bobDescription;
    if (bob === "") {
      bobDescription = EMPTY_WIDGET;
    } else {
      // Convert the bob to widget description style object
      bobDescription = convertBobToWidgetDescription(
        bob,
        {
          macros: bobMacrosToMacroMap,
          background_color: bobBackgroundColor, // eslint-disable-line @typescript-eslint/camelcase
          foreground_color: bobForegroundColor, // eslint-disable-line @typescript-eslint/camelcase
          precision: bobPrecisionToNumber,
          visible: bobVisibleToBoolen,
          style: bobAvoidStyleProp,
          actions: bobHandleActions
        },
        {
          pv_name: "pvName" // eslint-disable-line @typescript-eslint/camelcase
        }
      );
    }
    console.log(bobDescription);

    // Apply the Bob height to the top level if relative layout and none have been provided
    if (props.containerStyling.position === "relative") {
      props.containerStyling.height =
        props.containerStyling.height || bobDescription.height;
      props.containerStyling.width =
        props.containerStyling.width || bobDescription.width;
    }

    // Overflow set to scroll only if needed
    // If height or width is defined and is smaller than Bob
    const overflow =
      props.containerStyling.position === "absolute" &&
      (bobDescription.height > (props.containerStyling.height || 0) ||
        bobDescription.width > (props.containerStyling.width || 0))
        ? "scroll"
        : "visible";

    component = widgetDescriptionToComponent(
      {
        type: "display",
        containerStyling: props.containerStyling,
        widgetStyling: props.widgetStyling,
        overflow: overflow,
        children: [bobDescription]
      },
      widgetDict,
      macroMap
    );
  } catch (e) {
    log.error(`Error converting Bob into components in ${file}`);
    log.error(e.msg);
    log.error(e.object);
    component = widgetDescriptionToComponent(
      ERROR_WIDGET,
      widgetDict,
      macroMap
    );
  }

  return component;
};

WidgetFromBob.propTypes = WidgetFromBobProps;
