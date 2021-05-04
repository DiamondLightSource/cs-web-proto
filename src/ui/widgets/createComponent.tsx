import React from "react";
import log from "loglevel";
import { checkPropTypes } from "./checkPropTypes";

import { Color } from "../../types/color";
import { Shape } from "./Shape/shape";
import { REGISTERED_WIDGETS } from "./register";

export interface WidgetDescription {
  type: string;
  // All other component properties
  [x: string]: any;
  children?: WidgetDescription[];
}

class PropCheckFailed extends Error {
  public details: Record<string, unknown>;
  constructor(msg: string, details: Record<string, unknown>) {
    super(msg);
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, PropCheckFailed.prototype);
    this.details = details;
  }
}

export function widgetDescriptionToComponent(
  // Converts a JS object matching a position description into React component
  // from the component dictionary provided. Uses recursion to generate children.
  widgetDescription: WidgetDescription,
  listIndex?: number
): JSX.Element {
  const { type, children = [], ...otherProps } = widgetDescription;

  const widgetDict = Object.assign(
    {},
    ...Object.entries(REGISTERED_WIDGETS).map(([k, v]): any => ({ [k]: v[0] }))
  );

  let Component: React.FC<any>;
  if (widgetDict.hasOwnProperty(type)) {
    Component = widgetDict[type];
  } else {
    log.warn(`Failed to load unknown widget type ${type}:`);
    log.warn(widgetDescription);
    Component = Shape;
    otherProps.backgroundColor = Color.PURPLE;
  }

  // Perform checking on propTypes
  const error: string | undefined = checkPropTypes(
    /* We will need another way of using prop-types at runtime. */
    // eslint-disable-next-line react/forbid-foreign-prop-types
    Component.propTypes,
    otherProps,
    "widget description",
    Component.name,
    (): void => {
      log.debug("Got an error");
    }
  );
  if (error !== undefined) {
    throw new PropCheckFailed(error, {
      type: type,
      position: widgetDescription.position,
      ...otherProps
    });
  }

  // Create all children components - recursive
  const ChildComponents = children.map(
    (child, index): JSX.Element => widgetDescriptionToComponent(child, index)
  );
  // Return the node with children as children
  return (
    <Component
      // If this component has siblings, use its index in the array as a key.
      key={listIndex}
      position={widgetDescription.position}
      {...otherProps}
    >
      {ChildComponents}
    </Component>
  );
}
