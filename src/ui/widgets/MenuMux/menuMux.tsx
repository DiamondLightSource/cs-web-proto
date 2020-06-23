import React, { useContext } from "react";

import { Widget } from "../widget";
import { PVWidgetPropType } from "../widgetProps";
import { registerWidget } from "../register";
import { InferWidgetProps, StringProp, MacrosProp } from "../propTypes";
import { MacroContext } from "../../../types/macros";

export interface MenuMuxProps {
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  values: { [key: string]: string };
  selected: string;
}

export const MenuMuxComponent = (props: MenuMuxProps): JSX.Element => {
  const mappedOptions = Object.entries(props.values).map(
    ([name, value]): JSX.Element => {
      return (
        <option key={value} value={value}>
          {name}
        </option>
      );
    }
  );

  return (
    <select
      value={props.selected}
      style={{ width: "100%" }}
      onChange={props.onChange}
    >
      {mappedOptions}
    </select>
  );
};

export const SmartMenuMux = (props: {
  connected: boolean;
  symbol: string;
  values: { [key: string]: string };
}): JSX.Element => {
  const macroContext = useContext(MacroContext);
  function onChange(event: React.ChangeEvent<HTMLSelectElement>): void {
    macroContext.updateMacro(props.symbol, event.currentTarget.value);
  }
  if (macroContext.macros[props.symbol] === undefined) {
    macroContext.updateMacro(props.symbol, Object.values(props.values)[0]);
  }

  return (
    <MenuMuxComponent
      onChange={onChange}
      values={props.values}
      selected={macroContext.macros[props.symbol]}
    />
  );
};

const MenuMuxProps = {
  ...PVWidgetPropType,
  symbol: StringProp,
  values: MacrosProp
};

export const MenuMux = (
  props: InferWidgetProps<typeof MenuMuxProps>
): JSX.Element => <Widget baseWidget={SmartMenuMux} {...props} />;

registerWidget(MenuMux, MenuMuxProps, "menumux");
