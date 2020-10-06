import React, { CSSProperties } from "react";
import log from "loglevel";

import { TooltipWrapper } from "../components/TooltipWrapper/tooltipWrapper";
import { MenuWrapper } from "../components/MenuWrapper/menuWrapper";
import { useMacros } from "../hooks/useMacros";
import { useConnection } from "../hooks/useConnection";
import { useId } from "react-id-generator";
import { useRules } from "../hooks/useRules";
import { PVWidgetComponent, WidgetComponent } from "./widgetProps";
import { Border, BorderStyle } from "../../types/border";
import { Color } from "../../types/color";
import { Position, RelativePosition } from "../../types/position";
import { AlarmQuality } from "../../types/dtypes";
import { Font } from "../../types/font";

/**
 * Creates a CSSProperties object that formats borders, fonts, visiblity,
 * highlights, and background color that can be passed in as the style key
 * @param props properties of the widget to be formatted
 * @returns a CSSProperties object to pass into another element under the style key
 */
export function commonCss(props: {
  border?: Border;
  font?: Font;
  visible?: boolean;
  highlight?: boolean;
  backgroundColor?: Color;
}): CSSProperties {
  return {
    ...props.border?.css(),
    ...props.font?.css(),
    backgroundColor: props.backgroundColor?.rgbaString(),
    visibility: props.visible ? "hidden" : undefined,
    opacity: props.highlight ? "50%" : undefined
  };
}

// Function to recursively wrap a given set of widgets
/**
 * A function that recursively wraps all components in an array in
 * order of entry, container properties are applied to all components
 * except the base child, of which the widget properties are applied.
 * @param components The list of functional components to wrap in eachother
 * @param position The position of the parent component
 * @param containerProps The properties to apply to each component
 * @param widgetProps Widget properties to pass into the base child component
 * @returns One component with each subsequent component wrapped in the last
 * @example recursiveWrapping([Label, Input, Image], position, containerProps, widgetProps) ->
 * <Label style={position.css()} {...containerProps}>
 * Indent <Input style={position.css()} {...containerProps}>
 * DoubleIndent <Image style={position.css()} {...widgetProps} />
 * Indent </Input>
 * </Label>
 */
const recursiveWrapping = (
  components: React.FC<any>[],
  position: Position,
  containerProps: object,
  widgetProps: object
): JSX.Element => {
  const [Component, ...remainingComponents] = components;
  if (components.length === 1) {
    // Return the base widget
    return <Component style={position.css()} {...widgetProps} />;
  }
  // If container styling is not empty, use it on the wrapper widget
  // and pass on an empty object, otherwise wrap and move down
  else {
    return (
      <Component style={position.css()} {...containerProps}>
        {recursiveWrapping(
          remainingComponents,
          new RelativePosition("100%", "100%"),
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
/**
 * This component creates the connection aspect of a widget, and can
 * be returned by another function to allow react to rerender the child component (this function)
 * only, as opposed to rendering the parent component
 * @param props
 * @returns
 */
export const ConnectingComponent = (props: {
  components: React.FC<any>[];
  highlight?: string;
  containerStyling: Position;
  containerProps: any & { id: string };
  widgetProps: any;
  alarmBorder: boolean;
}): JSX.Element => {
  /* Add connection to PV and then recursively wrap widgets */

  const [effectivePvName, connected, readonly, latestValue] = useConnection(
    props.containerProps.id,
    props.containerProps.pvName?.qualifiedName(),
    props.containerProps.type
  );

  if (props.alarmBorder) {
    const severity = latestValue?.getAlarm()?.quality || AlarmQuality.VALID;
    const colors: { [key in AlarmQuality]: Color } = {
      [AlarmQuality.VALID]: Color.BLACK,
      [AlarmQuality.WARNING]: Color.YELLOW,
      [AlarmQuality.ALARM]: Color.RED,
      [AlarmQuality.INVALID]: Color.WHITE,
      [AlarmQuality.UNDEFINED]: Color.WHITE,
      [AlarmQuality.CHANGING]: Color.WHITE
    };
    if (severity !== AlarmQuality.VALID) {
      props.widgetProps.border = new Border(
        BorderStyle.Line,
        colors[severity],
        2
      );
    }
  }

  return recursiveWrapping(
    props.components,
    props.containerStyling,
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
  log.debug(`Widget id ${id}`);
  const macroProps = useMacros(idProps);
  // Then rules
  const ruleProps = useRules(macroProps) as PVWidgetComponent & { id: string };
  log.debug(`ruleProps ${ruleProps}`);
  log.debug(ruleProps);

  const { position, ...containerProps } = ruleProps;

  // Extract remaining parameters
  const {
    baseWidget,
    alarmBorder = false,
    ...baseWidgetProps
  } = containerProps;

  const components = [];

  if (props.actions && props.actions.actions.length > 0) {
    components.push(MenuWrapper);
  }
  components.push(TooltipWrapper);
  components.push(baseWidget);
  if (props.highlight) {
    baseWidgetProps.border = new Border(
      BorderStyle.Dashed,
      Color.parse(props.highlight),
      3
    );
  }

  // We could select the ConnectingComponent only if there is a PV
  // to which to connect, if we felt that would be more efficient.
  return (
    <ConnectingComponent
      alarmBorder={alarmBorder}
      highlight={props.highlight}
      components={components}
      containerStyling={position}
      containerProps={containerProps}
      widgetProps={baseWidgetProps}
    />
  );
};
