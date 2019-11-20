/* eslint react/forbid-foreign-prop-types: 0, no-throw-literal: 0 */

import React from "react";
import log from "loglevel";
// @ts-ignore
import checkPropTypes from "check-prop-types";

import { MacroMap } from "../../redux/csState";
import { WidgetProps } from "../Widget/widget";

export type WidgetDescription = WidgetProps & {
  type: string;
  // All other component properties
  [x: string]: any;
  children?: WidgetDescription[];
};

export function widgetDescriptionToComponent(
  // Converts a JS object matching a position description into React component
  // from the component dictionary provided. Also passes down a macro map which
  // can be overwritten. Uses recursion to generate children.
  widgetDescription: WidgetDescription,
  widgetDict: { [index: string]: React.FC<any> },
  existingMacroMap?: MacroMap,
  listIndex?: number
): JSX.Element {
  // Extract named properties and leave everything else in otherProps
  let {
    type,
    children = [],
    macroMap = {},
    containerStyling,
    ...otherProps
  } = widgetDescription;

  // Perform checking on propTypes
  let widgetInfo = { containerStyling: containerStyling, ...otherProps };
  console.log("Prop Type");
  console.log(widgetDict[type].propTypes);
  let error: string | undefined = checkPropTypes(
    widgetDict[type].propTypes,
    widgetInfo,
    "widget description",
    type,
    (): void => {
      log.debug("Got an error");
    }
  );
  if (error !== undefined) {
    throw {
      msg: error,
      object: {
        type: type,
        containerStyling: containerStyling,
        ...otherProps
      }
    };
  }

  // Collect macroMap passed into function and overwrite/add any
  // new values from the object macroMap
  const latestMacroMap = { ...existingMacroMap, ...macroMap };

  // Create the main component
  let Component = widgetDict[type];

  // Create all children components - recursive
  // Pass the latest macroMap down
  const ChildComponents = children.map(
    (child, index): JSX.Element =>
      widgetDescriptionToComponent(child, widgetDict, latestMacroMap, index)
  );
  // Return the node with children as children
  // Pass any extra props and macromap
  return (
    <Component
      // If this component has siblings, use its index in the array as a key.
      key={listIndex}
      containerStyling={containerStyling}
      macroMap={latestMacroMap}
      {...otherProps}
    >
      {ChildComponents}
    </Component>
  );
}
