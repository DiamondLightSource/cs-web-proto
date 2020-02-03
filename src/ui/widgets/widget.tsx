import React from "react";

import { TooltipWrapper } from "../components/TooltipWrapper/tooltipWrapper";
import { AlarmBorder } from "../components/AlarmBorder/alarmBorder";
import { MenuWrapper } from "../components/MenuWrapper/menuWrapper";
import { useMacros } from "../hooks/useMacros";
import { useConnection } from "../hooks/useConnection";
import { useId } from "react-id-generator";
import { useRules } from "../hooks/useRules";
import { resolveTooltip } from "./tooltip";

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

// eslint-disable-next-line no-template-curly-in-string
const DEFAULT_TOOLTIP = "${pvName}\n${pvValue}";

export const Widget = (
  props: PVWidgetComponent | WidgetComponent
): JSX.Element => {
  const [id] = useId();
  let tooltip = props.tooltip;
  if ("pvName" in props) {
    tooltip = props.tooltip ?? DEFAULT_TOOLTIP;
  }
  const idProps = { ...props, id: id, tooltip: tooltip };

  // Apply macros.
  const macroProps: AnyProps = useMacros(idProps);
  // Then rules
  const ruleProps: AnyProps = useRules(macroProps);
  // Connection hook must always be called even if pvName undefined.
  const [effectivePvName, connected, readonly, latestValue] = useConnection(
    id,
    ruleProps.pvName
  );
  const connectedProps = ruleProps;
  if ("pvName" in props) {
    connectedProps.pvName = effectivePvName;
    connectedProps.connected = connected;
    connectedProps.readonly = readonly;
    connectedProps.value = latestValue;
  }
  const resolvedTooltip = resolveTooltip(connectedProps);
  connectedProps.resolvedTooltip = resolvedTooltip;

  // Give containers access to everything apart from the containerStyling
  // Assume flexible position if not provided with anything
  const { containerStyling, ...containerProps } = connectedProps;

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

  return recursiveWrapping(
    components,
    mappedContainerStyling,
    widgetStyling,
    containerProps,
    baseWidgetProps
  );
};
