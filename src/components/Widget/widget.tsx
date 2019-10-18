import React from "react";

import { CopyWrapper } from "../CopyWrapper/copyWrapper";
import { AlarmBorder } from "../AlarmBorder/alarmBorder";
import { VType } from "../../vtypes/vtypes";
import { MacroMap } from "../../redux/csState";

interface ContainerFeatures {
  margin?: string;
  padding?: string;
}

// Absolute requires x, y, height, width
interface AbsoluteContainer extends ContainerFeatures {
  position: "absolute";
  x: number | string;
  y: number | string;
  width: number | string;
  height: number | string;
}

// Flexible places relatively and doesn't require any information but can
// include height and width information, otherwise will pop to default size
interface FlexibleContainer extends ContainerFeatures {
  position: "relative";
  // Width and height not always necessary in this case as some components
  // such as embedded screens will define their own dimensions
  width?: number | string;
  height?: number | string;
}

export interface ShapingInterface {
  containerStyling: AbsoluteContainer | FlexibleContainer;
  // ... other ways to customise the container itself could be added to this interface
  widgetStyling?: {
    font: string;
    fontSize: string | number;
    // ... all the styling things we want to allow
  };
  wrappers?: {
    copywrapper?: boolean;
    alarmborder?: boolean;
    // ...any other borders that come up in the future
  };
  macroMap?: MacroMap;
}

export interface PVWidgetInterface extends ShapingInterface {
  pvName: string;
  rawPvName?: string;
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
  if (components.length === 1) {
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

// Interface requires a base widget and allows child components
export interface WidgetInterface extends ShapingInterface {
  baseWidget: React.FC<any>;
  children?: React.ReactNode;
}

export const Widget = (props: WidgetInterface): JSX.Element => {
  // Generic widget component

  // Give containers access to everything apart from the containerStyling
  // Assume flexible position if not provided with anything
  const { containerStyling, ...containerProps } = props;

  // Manipulate for absolute styling
  // Put x and y back in as left and top respectively
  const { x = null, y = null } = { ...containerStyling };
  const mappedContainerStyling = { top: y, left: x, ...containerStyling };

  // Extract remaining parameters
  let {
    baseWidget,
    widgetStyling = {},
    wrappers = { alarmborder: false, copywrapper: false },
    ...baseWidgetProps
  } = containerProps;

  // Put appropriate components on the list of components to be wrapped
  let components = [];

  const requestedWrappers = {
    ...{ alarmborder: false, copywrapper: false },
    ...wrappers
  };

  if (requestedWrappers.alarmborder === true) {
    components.push(AlarmBorder);
  }
  if (requestedWrappers.copywrapper === true) {
    components.push(CopyWrapper);
  }

  components.push(baseWidget);

  return recursiveWrapping(
    components,
    mappedContainerStyling,
    widgetStyling,
    containerProps,
    baseWidgetProps
  );
};
