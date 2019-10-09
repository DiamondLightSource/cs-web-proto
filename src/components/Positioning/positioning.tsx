import React from "react";

// Interface to describe components by absolute position
export interface PositionDescription {
  // String which will be used as an index to a dictionary later
  type: string;
  // Absolute positions - allow strings for "%" or "px" etc
  x: number | string;
  y: number | string;
  width: number | string;
  height: number | string;
  // All other component properties
  [x: string]: any;
  // Array of any children nodes - children are all at same level
  // with respect to positioning
  children?: (PositionDescription | FlexiblePositionDescription)[] | null;
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
  // Array of any children nodes - children are all at same level
  // with respect to positioning
  children?: (PositionDescription | FlexiblePositionDescription)[] | null;
}

export function objectToPosition(
  inputObjects: PositionDescription | FlexiblePositionDescription | null,
  componentDict: { [index: string]: any }
): JSX.Element | null {
  // If there is nothing here, return null
  if (inputObjects === null) {
    return null;
  } else {
    // Extract properties
    let {
      x = null,
      y = null,
      flexible = false,
      height,
      width,
      type,
      children = null,
      ...otherProps
    } = inputObjects;

    // Create the main component
    let Component: React.FC = componentDict[type];

    // Create all children components - recursive
    let PositionedChildren = null;
    if (children) {
      PositionedChildren = children.map((child): JSX.Element | null =>
        objectToPosition(child, componentDict)
      );
    } else {
      PositionedChildren = null;
    }

    // Return the node with children as children
    if (flexible === false) {
      return (
        <div
          style={{
            position: "absolute",
            left: x,
            top: y,
            width: width,
            height: height
          }}
        >
          <Component {...otherProps}>{PositionedChildren}</Component>
        </div>
      );
    } else {
      return (
        <div
          style={{
            position: "static",
            width: width,
            height: height
          }}
        >
          <Component {...otherProps}>{PositionedChildren}</Component>
        </div>
      );
    }
  }
}
