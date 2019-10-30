import React from "react";
import PropTypes from "prop-types";

import { CopyWrapper } from "../CopyWrapper/copyWrapper";
import { AlarmBorder } from "../AlarmBorder/alarmBorder";
import { PvState } from "../../redux/csState";
import { useMacros } from "../MacroWrapper/macroWrapper";
import { useConnection } from "../ConnectionWrapper/connectionWrapper";
import {
  AbsoluteComponent,
  FlexibleComponent,
  WidgetStylingProps,
  PVWidgetExtraProps,
  MacroMapProps
} from "./widgetprops";

export type MacroMap = PropTypes.InferProps<typeof MacroMapProps>;

type WidgetStylingType = PropTypes.InferProps<typeof WidgetStylingProps>;
type AbsoluteType = PropTypes.InferProps<typeof AbsoluteComponent>;
type FlexibleType = PropTypes.InferProps<typeof FlexibleComponent>;

// Interface for the general functional component which creates a widget
export type WidgetProps = AbsoluteType | FlexibleType;
type WidgetComponent = WidgetProps & { baseWidget: React.FC<any> };

// Interface for widgets which handle PVs
// May be wrapped to display PV metadata
type PVWidgetExtras = PropTypes.InferProps<typeof PVWidgetExtraProps>;
export type PVWidgetProps = WidgetProps & PVWidgetExtras;

type PVWidgetComponent = PVWidgetProps & { baseWidget: React.FC<any> };

// Function to recursively wrap a given set of widgets
const recursiveWrapping = (
  components: React.FC<any>[],
  containerStyling: object,
  widgetStyling: WidgetStylingType | null,
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
