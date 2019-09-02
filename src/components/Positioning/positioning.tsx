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
  children?: PositionDescription[] | null;
}

export function objectToPosition(
  inputObjects: PositionDescription | null,
  componentDict: { [index: string]: any }
): JSX.Element | null {
  console.log("objectToPosition");
  console.log(inputObjects);

  // If there is nothing here, return null
  if (inputObjects === null) {
    return null;
  } else {
    // Extract properties
    let {
      x,
      y,
      height,
      width,
      type,
      children = null,
      ...otherProps
    } = inputObjects;

    console.log(type);

    // Create the main component
    let Component: React.FC = componentDict[type];

    // Create all children components - recursive
    let PositionedChildren = null;
    if (children) {
      PositionedChildren = children.map(child =>
        objectToPosition(child, componentDict)
      );
    } else {
      PositionedChildren = null;
    }

    // Return the node with children as children
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
  }
}
