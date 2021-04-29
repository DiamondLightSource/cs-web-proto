import React from "react";
import { writePv } from "../../hooks/useSubscription";

import { Widget } from "../widget";
import { PVWidgetPropType } from "../widgetProps";
import { registerWidget } from "../register";
import { InferWidgetProps, StringPropOpt } from "../propTypes";
import { DType } from "../../../types/dtypes";

export interface MenuButtonProps {
  connected: boolean;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  value?: DType;
  readonly: boolean;
  style?: Record<string, string>;
  label?: string;
}

export const MenuButtonComponent = (props: MenuButtonProps): JSX.Element => {
  const {
    connected,
    value = null,
    label,
    style = { color: "#000000" }
  } = props;

  // Store whether component is disabled or not
  let disabled = false;

  let options: string[] = label ? [label] : [];

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
    options = options.concat(value?.display?.choices);
    displayIndex = value.getDoubleValue() ?? 0;
    if (label) {
      displayIndex += 1;
    }
  } else {
    disabled = true;
  }

  const mappedOptions = options.map(
    (text, index): JSX.Element => {
      return (
        <option
          key={index}
          value={index}
          disabled={index === 0 && text === label}
        >
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
  style?: Record<string, string>;
  label?: string;
}): JSX.Element => {
  // Function to send the value on to the PV
  function onChange(event: React.ChangeEvent<HTMLSelectElement>): void {
    // The value from the select element is an integer as a string,
    // so we parse it into a float.
    writePv(
      props.pvName,
      new DType({ doubleValue: parseFloat(event.currentTarget.value) })
    );
  }

  return (
    <MenuButtonComponent
      connected={props.connected}
      value={props.value}
      style={props.style}
      readonly={props.readonly}
      onChange={onChange}
      label={props.label}
    />
  );
};

const MenuButtonWidgetProps = {
  ...PVWidgetPropType,
  label: StringPropOpt
};

export const MenuButton = (
  props: InferWidgetProps<typeof MenuButtonWidgetProps>
): JSX.Element => <Widget baseWidget={SmartMenuButton} {...props} />;

registerWidget(MenuButton, MenuButtonWidgetProps, "menubutton");
