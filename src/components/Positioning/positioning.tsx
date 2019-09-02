import React from "react";

export interface PositionDescription {
  type: string;
  x: number | string;
  y: number | string;
  width: number | string;
  height: number | string;
  // All other component properties
  [x: string]: any;
  children?: PositionDescription[] | null;
}

export function objectToPosition(
  inputObjects: PositionDescription | null,
  widgetDict: { [index: string]: React.FC }
): JSX.Element | null {
  console.log("objectToPosition");
  console.log(inputObjects);
  if (inputObjects === null) {
    return null;
  } else {
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

    let Widget: React.FC = widgetDict[type];

    let WidgetChildren = null;
    if (children) {
      WidgetChildren = children.map(child =>
        objectToPosition(child, widgetDict)
      );
    } else {
      WidgetChildren = null;
    }

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
        <Widget {...otherProps}>{WidgetChildren}</Widget>
      </div>
    );
  }
}
