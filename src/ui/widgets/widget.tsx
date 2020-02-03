import React from "react";

import { TooltipWrapper } from "../components/TooltipWrapper/tooltipWrapper";
import { AlarmBorder } from "../components/AlarmBorder/alarmBorder";
import { MenuWrapper } from "../components/MenuWrapper/menuWrapper";
import { useMacros } from "../hooks/useMacros";
import { useConnection } from "../hooks/useConnection";
import { useId } from "react-id-generator";
import { useRules } from "../hooks/useRules";

import {
  WidgetStyling,
  PVWidgetComponent,
  WidgetComponent,
  AnyProps
} from "./widgetProps";

// Useful types for components which will later be turned into widgets
// Required to define stateless component
// Function to recursively wrap a given set of widgets
const recursiveWrapping = (
  components: React.FC<any>[],
  containerStyling: object,
  widgetStyling: WidgetStyling | null,
  containerProps: object,
  widgetProps: object
): JSX.Element => {
  const [Component, ...remainingComponents] = components;
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
          { height: "100%", width: "100%" },
          widgetStyling,
          containerProps,
          widgetProps
        )}
      </Component>
    );
  }
};

/* Separate this component because the connection to the primary
   PV is likely to be the main source of updates. React can re-render
   this component but need not re-render Widget every time.
*/
export const ConnectingComponent = (props: {
  components: React.FC<any>[];
  containerStyling: object;
  widgetStyling: WidgetStyling | null;
  containerProps: any & { id: string };
  widgetProps: any;
}): JSX.Element => {
  /* Add connection to PV and then recursively wrap widgets */

  const [effectivePvName, connected, readonly, latestValue] = useConnection(
    props.containerProps.id,
    props.containerProps.pvName
  );

  return recursiveWrapping(
    props.components,
    props.containerStyling,
    props.widgetStyling,
    {
      ...props.containerProps,
      pvName: effectivePvName,
      connected: connected,
      readonly: readonly,
      value: latestValue
    },
    {
      ...props.widgetProps,
      pvName: effectivePvName,
      connected: connected,
      readonly: readonly,
      value: latestValue
    }
  );
};

// eslint-disable-next-line no-template-curly-in-string
const DEFAULT_TOOLTIP = "${pvName}\n${pvValue}";

export const Widget = (
  props: PVWidgetComponent | WidgetComponent
): JSX.Element => {
  const [id] = useId();
  let tooltip = props.tooltip;
  // Set default tooltip only for PV-enabled widgets.
  if ("pvName" in props && !props.tooltip) {
    tooltip = DEFAULT_TOOLTIP;
  }
  const idProps = { ...props, id: id, tooltip: tooltip };

  // Apply macros.
  const macroProps: AnyProps = useMacros(idProps);
  // Then rules
  const ruleProps = useRules(macroProps) as PVWidgetComponent & { id: string };

  // Give containers access to everything apart from the containerStyling
  // Assume flexible position if not provided with anything
  const { containerStyling, ...containerProps } = ruleProps;

  // Manipulate for absolute styling
  // Put x and y back in as left and top respectively
  const { x = null, y = null } = { ...containerStyling };
  const mappedContainerStyling = { top: y, left: x, ...containerStyling };

  // Extract remaining parameters
  const {
    baseWidget,
    widgetStyling = {},
    alarmBorder = false,
    ...baseWidgetProps
  } = containerProps;

  const components = [];

  if (props.actions && props.actions.actions.length > 0) {
    components.push(MenuWrapper);
  }
  if (alarmBorder) {
    components.push(AlarmBorder);
  }
  components.push(TooltipWrapper);
  components.push(baseWidget);

  // We could select the ConnectingComponent only if there is a PV
  // to which to connect, if we felt that would be more efficient.
  return (
    <ConnectingComponent
      components={components}
      containerStyling={mappedContainerStyling}
      widgetStyling={widgetStyling}
      containerProps={containerProps}
      widgetProps={baseWidgetProps}
    />
  );
};
