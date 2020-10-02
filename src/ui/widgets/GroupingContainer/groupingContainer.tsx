import React, { useContext } from "react";
import { Widget, commonCss } from "../widget";
import { WidgetPropType } from "../widgetProps";
import { registerWidget } from "../register";
import {
  StringProp,
  ChildrenPropOpt,
  InferWidgetProps,
  BorderPropOpt,
  MacrosPropOpt
} from "../propTypes";
import { MacroContextType, MacroContext } from "../../../types/macros";

const GroupingContainerProps = {
  name: StringProp,
  children: ChildrenPropOpt,
  border: BorderPropOpt,
  macros: MacrosPropOpt
};

// Generic display widget to put other things inside
export const GroupingContainerComponent = (
  props: InferWidgetProps<typeof GroupingContainerProps>
): JSX.Element => {
  const style = commonCss(props);

  // Include and override parent macros with those from the prop.
  const { updateMacro, macros } = useContext(MacroContext);
  const groupingContainerMacros = props.macros ?? {};
  const groupingContainerMacroContext: MacroContextType = {
    // Allow updating the macros of the containing display.
    updateMacro: updateMacro,
    macros: {
      ...macros, // lower priority
      ...groupingContainerMacros // higher priority
    }
  };

  return (
    <MacroContext.Provider value={groupingContainerMacroContext}>
      <div style={style}>{props.children}</div>
    </MacroContext.Provider>
  );
};

const GroupingWidgetProps = {
  ...GroupingContainerProps,
  ...WidgetPropType
};

export const GroupingContainer = (
  props: InferWidgetProps<typeof GroupingWidgetProps>
): JSX.Element => <Widget baseWidget={GroupingContainerComponent} {...props} />;

registerWidget(GroupingContainer, GroupingWidgetProps, "groupingcontainer");
