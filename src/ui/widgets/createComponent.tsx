/* eslint react/forbid-foreign-prop-types: 0, no-throw-literal: 0 */

import React from "react";
import log from "loglevel";
import checkPropTypes from "check-prop-types";

import { MacroMap } from "../../redux/csState";
import { Shape } from "./Shape/shape";
import { REGISTERED_WIDGETS } from "./register";
import { Color } from "../../types/color";

export interface WidgetDescription {
  type: string;
  // All other component properties
  [x: string]: any;
  children?: WidgetDescription[];
}

export function widgetDescriptionToComponent(
  // Converts a JS object matching a position description into React component
  // from the component dictionary provided. Also passes down a macro map which
  // can be overwritten. Uses recursion to generate children.
  widgetDescription: WidgetDescription,
  existingMacroMap?: MacroMap,
  listIndex?: number
): JSX.Element {
  const {
    type,
    children = [],
    macroMap = {},
    ...otherProps
  } = widgetDescription;

  const widgetDict = Object.assign(
    {},
    ...Object.entries(REGISTERED_WIDGETS).map(([k, v]): any => ({ [k]: v[0] }))
  );

  let Component: React.FC<any>;
  if (widgetDict.hasOwnProperty(type)) {
    Component = widgetDict[type];
  } else {
    log.warn(`Failed to load unknown widget type ${type}`);
    console.log(widgetDescription);
    Component = Shape;
    otherProps.backgroundColor = Color.PURPLE;
  }

  // Perform checking on propTypes
  const error: string | undefined = checkPropTypes(
    Component.propTypes,
    otherProps,
    "widget description",
    Component.name,
    (): void => {
      log.debug("Got an error");
    }
  );
  if (error !== undefined) {
    throw {
      msg: error,
      object: {
        type: type,
        position: widgetDescription.position,
        ...otherProps
      }
    };
  }

  // Collect macroMap passed into function and overwrite/add any
  // new values from the object macroMap
  const latestMacroMap = { ...existingMacroMap, ...macroMap };

  // Create all children components - recursive
  // Pass the latest macroMap down
  const ChildComponents = children.map(
    (child, index): JSX.Element =>
      widgetDescriptionToComponent(child, latestMacroMap, index)
  );
  // Return the node with children as children
  // Pass any extra props and macromap
  return (
    <Component
      // If this component has siblings, use its index in the array as a key.
      key={listIndex}
      position={widgetDescription.position}
      macroMap={latestMacroMap}
      {...otherProps}
    >
      {ChildComponents}
    </Component>
  );
}
