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
import { alarmOf, AlarmSeverity } from "../../types/vtypes/alarm";
import { Color } from "../../types/color";
import { Position, RelativePosition } from "../../types/position";
import { Font } from "../../types/font";

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
const recursiveWrapping = (
  components: React.FC<any>[],
  position: Position,
  containerProps: object,
  widgetProps: object
): JSX.Element => {
  const [Component, ...remainingComponents] = components;
  if (components.length === 1) {
    // Return the base widget
    return <Component style={{ ...position.css() }} {...widgetProps} />;
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
    props.containerProps.pvName?.qualifiedName()
  );

  if (props.alarmBorder) {
    const severity = alarmOf(latestValue).getSeverity();
    const colors: { [key in AlarmSeverity]: Color } = {
      [AlarmSeverity.NONE]: Color.BLACK,
      [AlarmSeverity.MINOR]: Color.YELLOW,
      [AlarmSeverity.MAJOR]: Color.RED,
      [AlarmSeverity.INVALID]: Color.WHITE,
      [AlarmSeverity.UNDEFINED]: Color.WHITE
    };
    if (severity !== AlarmSeverity.NONE) {
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
