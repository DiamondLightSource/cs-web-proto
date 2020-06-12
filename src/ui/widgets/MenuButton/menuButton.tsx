import React from "react";
import { writePv } from "../../hooks/useSubscription";

import { Widget } from "../widget";
import { PVWidgetPropType } from "../widgetProps";
import { registerWidget } from "../register";
import { InferWidgetProps } from "../propTypes";
import { DType, dtypeToString } from "../../../types/dtypes";

export interface MenuButtonProps {
  connected: boolean;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  value?: DType;
  readonly: boolean;
  style?: {};
}

export const MenuButtonComponent = (props: MenuButtonProps): JSX.Element => {
  const { connected, value = null, style = { color: "#000000" } } = props;

  // Store whether component is disabled or not
  let disabled = false;

  const defaultText = "Waiting for value";

  let options = [defaultText];
  // Using value to dictate displayed value as described here: https://reactjs.org/docs/forms.html#the-select-tag
  // Show 0 by default where there is only one option
  let displayIndex = 0;

  let readOnlyStyle = {};
  if (props.readonly === true) {
    disabled = true;
    readOnlyStyle = { cursor: "not-allowed" };
  }

  if (!connected || value === null) {
    disabled = true;
  } else if (value?.display?.choices) {
    options = value?.display?.choices;
    displayIndex = value.getDoubleValue();
  } else {
    options = [dtypeToString(value)];
    disabled = true;
  }

  const mappedOptions = options.map(
    (text, index): JSX.Element => {
      return (
        <option key={index} value={index}>
          {text}
        </option>
      );
    }
  );

  /* Don't disable the element itself because that prevents
     any interaction even for ancestor elements, including middle-click copy. */
  function onMouseDown(event: React.MouseEvent<HTMLSelectElement>): void {
    if (disabled) {
      event.preventDefault();
    }
  }

  return (
    <select
      value={displayIndex}
      onMouseDown={onMouseDown}
      style={{ width: "100%", ...readOnlyStyle, ...style }}
      onChange={props.onChange}
    >
      {mappedOptions}
    </select>
  );
};

// Menu button which also knows how to write to a PV
export const SmartMenuButton = (props: {
  connected: boolean;
  pvName: string;
  value?: DType;
  readonly: boolean;
  style?: {};
}): JSX.Element => {
  // Function to send the value on to the PV
  function onChange(event: React.ChangeEvent<HTMLSelectElement>): void {
    writePv(
      props.pvName,
      new DType({ stringValue: event.currentTarget.value })
    );
  }

  return (
    <MenuButtonComponent
      connected={props.connected}
      value={props.value}
      style={props.style}
      readonly={props.readonly}
      onChange={onChange}
    />
  );
};

export const MenuButton = (
  props: InferWidgetProps<typeof PVWidgetPropType>
): JSX.Element => <Widget baseWidget={SmartMenuButton} {...props} />;

registerWidget(MenuButton, PVWidgetPropType, "menubutton");
