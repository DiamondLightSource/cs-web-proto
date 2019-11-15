/* Provide the same component as fromJson but converting bob files and
providing a useful widget dictionary */

import React, { useState } from "react";
import PropTypes from "prop-types";
import log from "loglevel";
import convert from "xml-js";

import {
  WidgetDescription,
  widgetDescriptionToComponent
} from "../Positioning/positioning";
import { MacroMap } from "../../redux/csState";
import { Label } from "../Label/label";
import { Readback } from "../Readback/readback";
import { Input } from "../Input/input";
import { Display } from "../Display/display";
import { WidgetPropType, InferWidgetProps } from "../Widget/widget";

interface BobDescription {
  [key: string]: any;
}

const bobMacrosToMacroMap = (macros: object): MacroMap => {
  // Start with blank object
  let outputMacros: MacroMap = {};
  Object.entries(macros).forEach(([key, value]): void => {
    outputMacros[key] = value["_text"];
  });
  return outputMacros;
};

const bobChildToWidgetChild = (
  bobChild: BobDescription,
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
    macros = {},
    widget = [],
    ...remainingProps
  } = bobChild;

  // Map the remaining props
  // Checks that there is a substitution map
  let mappedProps: { [key: string]: any } = {};
  Object.entries(remainingProps).map(([key, value]): void =>
    keySubstitutions && keySubstitutions[key]
      ? (mappedProps[keySubstitutions[key]] = value._text)
      : (mappedProps[key] = value._text)
  );

  // Check that the primary props were defined or use a default value
  let outputWidget: WidgetDescription = {
    type: _attributes.type,
    containerStyling: {
      position: "absolute",
      x: `${(x && x._text) || 0}px`,
      y: `${(y && y._text) || 0}px`,
      height: `${(height && height._text) || 0}px`,
      width: `${(width && width._text) || 0}px`
    },
    macroMap: bobMacrosToMacroMap(macros),
    ...mappedProps,
    children: widget.map(
      (w: any): WidgetDescription =>
        bobChildToWidgetChild(w as BobDescription, keySubstitutions)
    )
  };

  return outputWidget;
};

export const convertBobToWidgetDescription = (
  bobInputString: string,
  keySubstitutions?: { [key: string]: any }
): WidgetDescription => {
  // Provide a raw xml file in the bob format for conversion
  // Optionally provide a substition map for keys

  // Convert it to a "compact format"
  const compactJSON = convert.xml2js(bobInputString, {
    compact: true
  }) as BobDescription;

  console.log(compactJSON);
  console.log(bobMacrosToMacroMap(compactJSON.display.macros));

  // Extract children if there are any
  const children = compactJSON.display.widget || [];

  // Special case for the root component
  let rootDescription: WidgetDescription = {
    type: "display",
    containerStyling: {
      position: "absolute",
      x: 0,
      y: 0,
      width: `${compactJSON.display.width._text}px`,
      height: `${compactJSON.display.height._text}px`
    },
    macroMap: bobMacrosToMacroMap(compactJSON.display.macros),
    children: children.map(
      (w: any): WidgetDescription =>
        bobChildToWidgetChild(w as BobDescription, keySubstitutions)
    )
  };

  return rootDescription;
};

const EMPTY_WIDGET: WidgetDescription = {
  type: "empty",
  containerStyling: { position: "absolute", x: 0, y: 0, width: 0, height: 0 }
};

const ERROR_WIDGET: WidgetDescription = {
  type: "label",
  containerStyling: { position: "relative" },
  widgetStyling: {
    fontWeight: "bold",
    backgroundColor: "red"
  },
  text: "Error"
};

const WidgetFromBobProps = {
  file: PropTypes.string.isRequired,
  ...WidgetPropType
};

export const WidgetFromBob = (
  props: InferWidgetProps<typeof WidgetFromBobProps>
): JSX.Element | null => {
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
    textentry: Input,
    label: Label,
    group: Display,
    display: Display,
    empty: Display,
    widgetFromBob: WidgetFromBob
  };

  let component: JSX.Element | null;
  try {
    let bobDescription;
    if (bob === "") {
      bobDescription = EMPTY_WIDGET;
    } else {
      // Convert the bob to widget description style object
      bobDescription = convertBobToWidgetDescription(bob, {
        pv_name: "pvName" // eslint-disable-line @typescript-eslint/camelcase
      });
    }
    console.log(bobDescription);
    component = (
      <Display
        containerStyling={{ ...props.containerStyling, ...props.widgetStyling }}
      >
        {widgetDescriptionToComponent(bobDescription, widgetDict, macroMap)}
      </Display>
    );
  } catch (e) {
    log.error(`Error converting Bob into components in ${file}`);
    log.error(e.msg);
    log.error(e.object);
    component = (
      <Display
        containerStyling={{ ...props.containerStyling, ...props.widgetStyling }}
      >
        {widgetDescriptionToComponent(ERROR_WIDGET, widgetDict, macroMap)}
      </Display>
    );
  }

  return component;
};

WidgetFromBob.propTypes = WidgetFromBobProps;
