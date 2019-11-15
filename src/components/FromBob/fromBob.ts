/* Provide the same component as fromJson but converting bob files and
providing a useful widget dictionary */

import convert from "xml-js";

import { WidgetDescription } from "../Positioning/positioning";
import { MacroMap } from "../../redux/csState";

type BobDescription = { [key: string]: any };

export const convertBobToWidgetDescription = (
  xml_input: string,
  keySubstitutions?: { [key: string]: any }
): WidgetDescription => {
  // Provide a raw xml file in the bob format for conversion
  // Optionally provide a substition map for keys

  // Convert it to a "compact format"
  const compactJSON = convert.xml2js(xml_input, {
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
    children: children.map((w: any) =>
      bobChildToWidgetChild(w as BobDescription, keySubstitutions)
    )
  };

  return rootDescription;
};

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

  let outputWidget: WidgetDescription = {
    type: _attributes.type,
    containerStyling: {
      position: "absolute",
      x: `${x._text || 0}px`,
      y: `${y._text || 0}px`,
      height: `${height._text || 0}px`,
      width: `${width._text || 0}px`
    },
    ...mappedProps,
    children: widget.map((w: any) =>
      bobChildToWidgetChild(w as BobDescription, keySubstitutions)
    )
  };

  return outputWidget;
};
