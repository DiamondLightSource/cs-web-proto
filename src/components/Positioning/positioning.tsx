import React from "react";
import { MacroMap } from "../../redux/csState";
import { MacroProps } from "../MacroWrapper/macroWrapper";

// BasicPositionDescription contains elements required by all position descriptions
interface BasicPositionDescription {
  // String which will be used as an index to a dictionary later
  type: string;
  // All other component properties
  [x: string]: any;
  // Object for styling the container which contains the children
  containerStyling?: object;
  // Macro map if it is provided
  macroMap?: MacroMap;
  // Array of any children nodes - children are all at same level
  // with respect to positioning
  children?:
    | (AbsolutePositionDescription | FlexiblePositionDescription)[]
    | null;
}

// Interface to describe components by absolute position
export interface AbsolutePositionDescription extends BasicPositionDescription {
  // Absolute positions - allow strings for "%" or "px" etc
  x: number | string;
  y: number | string;
  width: number | string;
  height: number | string;
}

// Interface to describe components by relative position
export interface FlexiblePositionDescription extends BasicPositionDescription {
  // Flexible positions - should go inside a flex container
  flexible: boolean;
  // Width and height not always necessary in this case as some components
  // such as embedded screens will define their own dimensions
  width?: number | string;
  height?: number | string;
}

export function objectToComponent(
  // Converts a JS object matching a position description into React component
  // from the component dictionary provided. Also passes down a macro map which
  // can be overwritten. Uses recursion to generate children.
  objectDescription:
    | AbsolutePositionDescription
    | FlexiblePositionDescription
    | null,
  componentDict: { [index: string]: any },
  existingMacroMap: MacroMap
): JSX.Element | null {
  // If there is nothing here, return null
  if (objectDescription === null) {
    return null;
  } else {
    // Extract named properties and leave everything else in otherProps
    let {
      type,
      x = null,
      y = null,
      flexible = false,
      height = null,
      width = null,
      containerStyling = {},
      children = null,
      macroMap = {},
      ...otherProps
    } = objectDescription;

    // Collect macroMap passed into function and overwrite/add any
    // new values from the object macroMap
    const latestMacroMap = { ...existingMacroMap, ...macroMap };

    // Create the main component
    let Component: React.FC<MacroProps> = componentDict[type];

    // Create all children components - recursive
    // Pass the latest macroMap down
    let ChildComponents = null;
    if (children) {
      ChildComponents = children.map((child): JSX.Element | null =>
        objectToComponent(child, componentDict, latestMacroMap)
      );
    } else {
      ChildComponents = null;
    }

    // Create the style with absolute or flexible positioning as required
    let parentStyling = {};
    if (flexible === false) {
      parentStyling = {
        position: "absolute",
        left: x,
        top: y,
        width: width,
        height: height,
        ...containerStyling
      };
    } else {
      parentStyling = {
        position: "relative",
        width: width,
        height: height,
        ...containerStyling
      };
    }

    // Return the node with children as children
    // Pass any extra props and macromap
    return (
      <div style={parentStyling}>
        <Component {...otherProps} macroMap={latestMacroMap}>
          {ChildComponents}
        </Component>
      </div>
    );
  }
}
