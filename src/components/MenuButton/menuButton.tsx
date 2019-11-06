import React from "react";
import { writePv } from "../../hooks/useSubscription";

import { VType, VEnum } from "../../vtypes/vtypes";
import { vtypeToString, stringToVtype } from "../../vtypes/utils";
import {
  InferWidgetProps,
  PVComponent,
  PVWidget,
  PVWidgetPropType
} from "../Widget/widget";

export interface MenuButtonProps {
  connected: boolean;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  value?: VType;
  readonly: boolean;
  style?: {};
}

export const MenuButtonComponent = (props: MenuButtonProps): JSX.Element => {
  let { connected, value = null, style = { color: "#000000" } } = props;

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
  } else if (value instanceof VEnum) {
    options = value.getDisplay().getChoices();
    displayIndex = value.getIndex();
  } else {
    options = [vtypeToString(value)];
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

  return (
    <select
      value={displayIndex}
      disabled={disabled}
      style={{ width: "100%", ...readOnlyStyle, ...style }}
      onChange={props.onChange}
    >
      {mappedOptions}
    </select>
  );
};

// Menu button which also knows how to write to a PV
export const SmartMenuButton = (props: PVComponent): JSX.Element => {
  // Function to send the value on to the PV
  function onChange(event: React.ChangeEvent<HTMLSelectElement>): void {
    writePv(props.pvName, stringToVtype(event.currentTarget.value));
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
): JSX.Element => <PVWidget baseWidget={SmartMenuButton} {...props} />;

MenuButton.propTypes = PVWidgetPropType;
