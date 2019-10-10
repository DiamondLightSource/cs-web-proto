import React from "react";
import { MacroMap } from "../../redux/csState";
import { MacroProps } from "../MacroWrapper/macroWrapper";

// Interface to describe components by absolute position
export interface AbsolutePositionDescription {
  // String which will be used as an index to a dictionary later
  type: string;
  // Absolute positions - allow strings for "%" or "px" etc
  x: number | string;
  y: number | string;
  width: number | string;
  height: number | string;
  // All other component properties
  [x: string]: any;
  // Object for styling the container which contains the children
  containerStyling?: object;
  // Macro map if it is provided
  macroMap?: MacroMap;
  // Array of any children nodes - children are all at same level
  // with respect to positioning#
  children?:
    | (AbsolutePositionDescription | FlexiblePositionDescription)[]
    | null;
}

export interface FlexiblePositionDescription {
  // String which will be used as an index to a dictionary later
  type: string;
  // Flexible positions - should go inside a flex container
  flexible: boolean;
  // Width and height not always necessary in this case as some components
  // such as embedded screens will define their own dimensions
  width?: number | string;
  height?: number | string;
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

export function objectToPosition(
  inputObjects:
    | AbsolutePositionDescription
    | FlexiblePositionDescription
    | null,
  componentDict: { [index: string]: any },
  existingMacroMap: MacroMap
): JSX.Element | null {
  // If there is nothing here, return null
  if (inputObjects === null) {
    return null;
  } else {
    // Extract properties
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
    } = inputObjects;

    // Collect macroMap passed into function and overwrite/add any
    // new values from the object macroMap
    const latestMacroMap = { ...existingMacroMap, ...macroMap };

    // Create the main component
    let Component: React.FC<MacroProps> = componentDict[type];

    // Create all children components - recursive
    // Pass the latest macroMap down
    let PositionedChildren = null;
    if (children) {
      PositionedChildren = children.map((child): JSX.Element | null =>
        objectToPosition(child, componentDict, latestMacroMap)
      );
    } else {
      PositionedChildren = null;
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
    // Pass any extra props including macromap
    return (
      <div style={parentStyling}>
        <Component {...otherProps} macroMap={latestMacroMap}>
          {PositionedChildren}
        </Component>
      </div>
    );
  }
}
