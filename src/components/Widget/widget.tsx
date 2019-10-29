import React from "react";

import { CopyWrapper } from "../CopyWrapper/copyWrapper";
import { AlarmBorder } from "../AlarmBorder/alarmBorder";
import { MacroMap, PvState } from "../../redux/csState";
import { useMacros } from "../MacroWrapper/macroWrapper";
import { useConnection } from "../ConnectionWrapper/connectionWrapper";

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

export interface WidgetProps {
  containerStyling: AbsoluteContainer | FlexibleContainer;
  // ... other ways to customise the container itself could be added to this interface
  widgetStyling?: {
    font?: string;
    fontSize?: string | number;
    fontWeight?: string | number;
    textAlign?: "center" | "left" | "right" | "justify";
    backgroundColor?: string;
    // ... all the styling things we want to allow
  };
  macroMap?: MacroMap;
}

// Interface for the general functional component which creates a widget
type WidgetComponent = WidgetProps & { baseWidget: React.FC<any> };

// Interface for widgets which handle PVs
// May be wrapped to display PV metadata
export interface PVWidgetProps extends WidgetProps {
  pvName: string;
  wrappers?: {
    copywrapper?: boolean;
    alarmborder?: boolean;
  };
}

type PVWidgetComponent = PVWidgetProps & { baseWidget: React.FC<any> };

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

export const Widget = (props: WidgetComponent): JSX.Element => {
  // Generic widget component

  // Apply macros.
  const macroProps = useMacros(props);
  // Then rules

  // Give containers access to everything apart from the containerStyling
  // Assume flexible position if not provided with anything
  const { containerStyling, ...containerProps } = macroProps;

  // Manipulate for absolute styling
  // Put x and y back in as left and top respectively
  const { x = null, y = null } = { ...containerStyling };
  const mappedContainerStyling = { top: y, left: x, ...containerStyling };

  // Extract remaining parameters
  let { baseWidget, widgetStyling = {}, ...baseWidgetProps } = containerProps;

  // Put appropriate components on the list of components to be wrapped
  let components = [baseWidget];

  return recursiveWrapping(
    components,
    mappedContainerStyling,
    widgetStyling,
    containerProps,
    baseWidgetProps
  );
};

export const PVWidget = (props: PVWidgetComponent): JSX.Element => {
  // Apply macros.
  const macroProps = useMacros(props);
  // Then rules
  const [, connected, readonly, latestValue] = useConnection(macroProps.pvName);
  let newProps: PVWidgetComponent & PvState = {
    ...props,
    initializingPvName: props.pvName,
    connected: connected,
    readonly: readonly,
    value: latestValue
  };
  // Give containers access to everything apart from the containerStyling
  // Assume flexible position if not provided with anything
  const { containerStyling, ...containerProps } = newProps;

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

  const components = [];
  // Done like this in case only one of the values is passed through
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
