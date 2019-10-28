import React from "react";

import { CopyWrapper } from "../CopyWrapper/copyWrapper";
import { AlarmBorder } from "../AlarmBorder/alarmBorder";
import { MacroMap } from "../../redux/csState";
import { macroWrapper } from "../MacroWrapper/macroWrapper";
import { connectionWrapper } from "../ConnectionWrapper/connectionWrapper";
import { MenuWrapper } from "../MenuWrapper/menuWrapper";

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

export interface BaseWidgetInterface {
  containerStyling: AbsoluteContainer | FlexibleContainer;
  // ... other ways to customise the container itself could be added to this interface
  widgetStyling?: {
    font: string;
    fontSize: string | number;
    fontWeight: string | number;
    textAlign: "center" | "left" | "right" | "justify";
    backgroundColor: string;
    // ... all the styling things we want to allow
  };
  macroMap?: MacroMap;
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

// Interface for the general functional component which creates a widget
// May have wrappers
export interface WidgetComponentInterface extends BaseWidgetInterface {
  baseWidget: React.FC<any>;
  wrappers?: {
    copywrapper?: boolean;
    alarmborder?: boolean;
    menuwrapper?: boolean;
  };
}

export const WidgetComponent = (
  props: WidgetComponentInterface
): JSX.Element => {
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
    wrappers = {},
    ...baseWidgetProps
  } = containerProps;

  // Put appropriate components on the list of components to be wrapped
  let components = [];

  // Done like this in case only one of the values is passed through
  const requestedWrappers = {
    ...{ alarmborder: false, copywrapper: false, menuwrapper: false },
    ...wrappers
  };

  if (requestedWrappers.alarmborder === true) {
    components.push(AlarmBorder);
  }
  if (requestedWrappers.copywrapper === true) {
    components.push(CopyWrapper);
  }
  if (requestedWrappers.menuwrapper === true) {
    components.push(MenuWrapper);
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

// Interface for a widget which does not handle PVs
// Label, display, containers
// No support for wrapping as this would not make sense
// when they have no PV
export interface WidgetInterface extends BaseWidgetInterface {
  children?: React.ReactNode;
}

export const Widget: React.FC<
  WidgetComponentInterface & WidgetInterface
> = macroWrapper(WidgetComponent);

// Interface for widgets which handle PVs
// May be wrapped to display PV metadata
export interface PVWidgetInterface extends WidgetInterface {
  pvName: string;
  wrappers?: {
    copywrapper?: boolean;
    alarmborder?: boolean;
    // ...any other borders that come up in the future
  };
}
export const PVWidget: React.FC<
  WidgetComponentInterface & PVWidgetInterface
> = macroWrapper(connectionWrapper(WidgetComponent));
