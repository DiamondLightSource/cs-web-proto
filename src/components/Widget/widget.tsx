import React from "react";
import PropTypes from "prop-types";

import { TooltipWrapper } from "../TooltipWrapper/tooltipWrapper";
import { AlarmBorder } from "../AlarmBorder/alarmBorder";
import { MenuWrapper } from "../MenuWrapper/menuWrapper";
import { PvState } from "../../redux/csState";
import { useMacros } from "../../hooks/useMacros";
import { useConnection } from "../../hooks/useConnection";
import { useId } from "react-id-generator";
import { useRules } from "../../hooks/useRules";
import { resolveTooltip } from "./tooltip";
import {
  ContainerFeaturesPropType,
  ActionsPropType,
  StringOrNumProp,
  StringPropOpt,
  BoolPropOpt,
  MapStringString,
  InferWidgetProps
} from "../propTypes";

// Useful types for components which will later be turned into widgets
// Required to define stateless component
export interface Component {
  style?: object;
}

export type PVComponent = Component & PvState;
export type PVInputComponent = PVComponent & { pvName: string };

const RulesPropType = PropTypes.shape({
  condition: PropTypes.string.isRequired,
  trueState: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).isRequired,
  falseState: PropTypes.oneOfType([PropTypes.string, PropTypes.bool])
    .isRequired,
  substitutionMap: MapStringString,
  prop: PropTypes.string.isRequired
});

const AbsoluteContainerProps = {
  position: PropTypes.oneOf(["absolute"]).isRequired,
  x: StringOrNumProp,
  y: StringOrNumProp,
  height: StringOrNumProp,
  width: StringOrNumProp,
  ...ContainerFeaturesPropType
};

const FlexibleContainerProps = {
  position: PropTypes.oneOf(["relative"]).isRequired,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  ...ContainerFeaturesPropType
};

const WidgetStylingPropType = {
  font: PropTypes.string,
  fontSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  fontWeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  textAlign: PropTypes.oneOf(["center", "left", "right", "justify"]),
  backgroundColor: PropTypes.string,
  color: PropTypes.string
};
type WidgetStyling = InferWidgetProps<typeof WidgetStylingPropType>;

const CommonWidgetProps = {
  widgetStyling: PropTypes.shape(WidgetStylingPropType),
  macroMap: PropTypes.objectOf(PropTypes.string.isRequired),
  rules: PropTypes.arrayOf(RulesPropType),
  actions: ActionsPropType,
  tooltip: PropTypes.string,
  resolvedTooltip: PropTypes.string,
  menuWrapper: PropTypes.bool
};

const AbsoluteComponentPropType = {
  containerStyling: PropTypes.shape(AbsoluteContainerProps).isRequired,
  ...CommonWidgetProps
};
type AbsoluteType = InferWidgetProps<typeof AbsoluteComponentPropType>;

const FlexibleComponentPropType = {
  containerStyling: PropTypes.shape(FlexibleContainerProps).isRequired,
  ...CommonWidgetProps
};
type FlexibleType = InferWidgetProps<typeof FlexibleComponentPropType>;

// PropTypes object for a widget which can be expanded
export const WidgetPropType = {
  containerStyling: PropTypes.oneOfType([
    PropTypes.exact(AbsoluteContainerProps),
    PropTypes.exact(FlexibleContainerProps)
  ]).isRequired,
  ...CommonWidgetProps
};
// Allows for either absolute or flexible positioning
export type WidgetProps = AbsoluteType | FlexibleType;
// Internal type for creating widgets
type WidgetComponent = WidgetProps & { baseWidget: React.FC<any> };

// Internal prop types object for properties which are not in a standard widget
const PVExtras = {
  pvName: StringPropOpt,
  alarmBorder: BoolPropOpt
};
// PropTypes object for a PV widget which can be expanded
export const PVWidgetPropType = {
  ...PVExtras,
  ...WidgetPropType
};
export type PVWidgetProps = WidgetProps & InferWidgetProps<typeof PVExtras>;
type PVWidgetComponent = PVWidgetProps & { baseWidget: React.FC<any> };

// Function to recursively wrap a given set of widgets
const recursiveWrapping = (
  components: React.FC<any>[],
  containerStyling: object,
  widgetStyling: WidgetStyling | null,
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
          { height: "100%", width: "100%" },
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
  const [id] = useId();
  let idProps = { ...props, id: id };

  // Apply macros.
  const macroProps = useMacros(idProps) as WidgetComponent & { id: string };
  // Then rules
  const ruleProps = useRules(macroProps);
  const resolvedTooltip = resolveTooltip(ruleProps);
  ruleProps["resolvedTooltip"] = resolvedTooltip;

  // Give containers access to everything apart from the containerStyling
  // Assume flexible position if not provided with anything
  const { containerStyling, ...containerProps } = ruleProps;

  // Manipulate for absolute styling
  // Put x and y back in as left and top respectively
  const { x = null, y = null } = { ...containerStyling };
  const mappedContainerStyling = { top: y, left: x, ...containerStyling };

  // Extract remaining parameters
  let { baseWidget, widgetStyling = {}, ...baseWidgetProps } = containerProps;

  // Put appropriate components on the list of components to be wrapped
  const components = [];
  if (props.actions && props.actions.actions.length > 0) {
    components.push(MenuWrapper);
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
// eslint-disable-next-line no-template-curly-in-string
const DEFAULT_TOOLTIP = "${pvName}\n${pvValue}";

export const PVWidget = (props: PVWidgetComponent): JSX.Element => {
  const [id] = useId();
  const tooltip = props.tooltip === undefined ? DEFAULT_TOOLTIP : props.tooltip;
  let idProps = { ...props, id: id, tooltip: tooltip };

  // Apply macros.
  const macroProps = useMacros(idProps) as PVWidgetComponent & { id: string };
  // Then rules
  const ruleProps = useRules(macroProps) as PVWidgetComponent & { id: string };
  const [effectivePvName, connected, readonly, latestValue] = useConnection(
    id,
    ruleProps.pvName
  );
  let connectedProps = {
    ...ruleProps,
    pvName: effectivePvName,
    connected: connected,
    readonly: readonly,
    value: latestValue
  };
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
  let {
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
