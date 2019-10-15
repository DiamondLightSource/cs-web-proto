import React from "react";
import { connectionWrapper } from "../ConnectionWrapper/connectionWrapper";
import { writePv } from "../../hooks/useCs";

import { VType, VEnum } from "../../vtypes/vtypes";
import { vtypeToString, stringToVtype } from "../../vtypes/utils";
import { Alarm } from "../../vtypes/alarm";

export const MenuButton = (props: {
  connected: boolean;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  value?: VType;
  style?: {};
}): JSX.Element => {
  let { connected, value = null, style = { color: "#000000" } } = props;

  // Store whether component is disabled or not
  let disabled = false;

  const defaultText = "Waiting for value";

  let options = [defaultText];
  let selectedIndex = 0;

  if (!connected || value === null) {
    disabled = true;
  } else if (value instanceof VEnum) {
    options = value.getDisplay().getChoices();
    selectedIndex = value.getIndex();
  } else {
    options = [vtypeToString(value)];
    disabled = true;
  }

  const mappedOptions = options.map(
    (text, index): JSX.Element => {
      // Add selected attribute to option if index matches
      let selected = index === selectedIndex;
      return (
        <option key={index} value={index} selected={selected}>
          {text}
        </option>
      );
    }
  );

  return (
    <select disabled={disabled} style={style} onChange={props.onChange}>
      {mappedOptions}
    </select>
  );
};

// Menu button which also knows how to write to a PV
export const SmartMenuButton = (props: {
  connected: boolean;
  pvName: string;
  value?: VType;
  style?: {};
}): JSX.Element => {
  // Function to send the value on to the PV
  function onChange(event: React.ChangeEvent<HTMLSelectElement>): void {
    writePv(props.pvName, stringToVtype(event.currentTarget.value));
  }

  return (
    <MenuButton
      connected={props.connected}
      value={props.value}
      style={props.style}
      onChange={onChange}
    />
  );
};

interface ConnectedMenuButtonProps {
  pvName: string;
  rawPvName?: string;
  precision?: number;
  alarm?: Alarm;
  style?: {};
}

export const ConnectedMenuButton: React.FC<
  ConnectedMenuButtonProps
> = connectionWrapper(SmartMenuButton);
