import React from "react";

import { AbsolutePosition, FlexiblePosition } from "../Positioning/positioning";
import { CopyWrapper } from "../CopyWrapper/copyWrapper";
import { AlarmBorder } from "../AlarmBorder/alarmBorder";
import { VType } from "../../vtypes/vtypes";

interface ShapingInterface {
  containerStyling: {
    positioning: AbsolutePosition | FlexiblePosition;
    margin: string;
    // ... other ways to customise the container itself
  };
  widgetStyling?: {
    font: string;
    fontSize: string | number;
    // ... all the styling things we want to allow
  };
  wrappers: {
    copywrapper: boolean;
    alarmborder: boolean;
    // ...any other borders that come up in the future
  };
}

export interface WidgetInterface extends ShapingInterface {
  pvName: string;
  connected: boolean;
  value?: VType | undefined;
}

export interface ConnectedWidgetInterface extends ShapingInterface {
  pvName: string;
}

// Function to recursively wrap a given set of widgets
const recursiveWrapping = (
  components: React.FC<any>[],
  containerStyling: object,
  widgetStyling: object,
  containerProps: object,
  widgetProps: object
): JSX.Element => {
  let [Component, ...remainingComponents] = components;
  if (components.length === 0) {
    // Return the base widget
    return (
      <Component
        style={{ ...containerStyling, ...widgetStyling }}
        {...widgetProps}
      />
    );
  }
  // If container styling is not empty, use it on the wrapper widget
  // and pass on an empty object, otherwise wrap and move down
  else {
    return (
      <Component style={containerStyling} {...containerProps}>
        {recursiveWrapping(
          remainingComponents,
          {},
          widgetStyling,
          containerProps,
          widgetProps
        )}
      </Component>
    );
  }
};

export const Widget = (
  props: { widget: React.FC<any> } & WidgetInterface
): JSX.Element => {
  // Function to recursively apply wrappers with containerStyling going at the top level

  // Extract parameters
  let {
    widget,
    pvName,
    connected,
    value = null,
    containerStyling,
    widgetStyling = {},
    wrappers,
    ...widgetProps
  } = props;

  const containerProps = { pvName: pvName, connected: connected, value: value };

  let components = [];

  if (wrappers.alarmborder === true) {
    components.push(AlarmBorder);
  }
  if (wrappers.copywrapper === true) {
    components.push(CopyWrapper);
  }

  components.push(widget);

  return recursiveWrapping(
    components,
    containerStyling,
    widgetStyling,
    containerProps,
    widgetProps
  );
};
