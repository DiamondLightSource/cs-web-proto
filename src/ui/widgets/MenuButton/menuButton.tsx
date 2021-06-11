import React, { CSSProperties, useContext } from "react";

import { commonCss, Widget } from "../widget";
import { PVWidgetPropType } from "../widgetProps";
import { registerWidget } from "../register";
import {
  BoolProp,
  ColorPropOpt,
  InferWidgetProps,
  StringPropOpt
} from "../propTypes";
import { DType } from "../../../types/dtypes";
import {
  executeAction,
  getActionDescription,
  WidgetAction,
  WidgetActions,
  WritePv,
  WRITE_PV
} from "../widgetActions";
import { FileContext } from "../../../fileContext";
import { Border } from "../../../types/border";
import { Color } from "../../../types/color";

export interface MenuButtonProps {
  connected: boolean;
  onChange: (action: WidgetAction) => void;
  pvName?: string;
  value?: DType;
  readonly: boolean;
  actionsFromPv: boolean;
  label?: string;
  actions?: WidgetActions;
  foregroundColor?: Color;
  backgroundColor?: Color;
  border?: Border;
}

export const MenuButtonComponent = (props: MenuButtonProps): JSX.Element => {
  const {
    connected,
    value = null,
    readonly,
    actionsFromPv,
    pvName,
    label
  } = props;
  let actions: WidgetAction[] = props.actions?.actions || [];

  // Store whether component is disabled or not
  let disabled = readonly;

  let options: string[] = label ? [label] : [];
  const displayOffset = label ? 1 : 0;

  // Using value to dictate displayed value as described here: https://reactjs.org/docs/forms.html#the-select-tag
  // Show 0 by default where there is only one option
  let displayIndex = 0;

  if (actionsFromPv && pvName) {
    if (!connected || value === null) {
      disabled = true;
    } else if (value?.display?.choices) {
      options = options.concat(value?.display?.choices);
      actions = options.map((option, i) => {
        const writePv: WritePv = {
          type: WRITE_PV,
          writePvInfo: {
            pvName: pvName,
            value: i
          }
        };
        return writePv;
      });
      displayIndex = (value.getDoubleValue() ?? 0) + displayOffset;
    } else {
      disabled = true;
    }
  } else {
    options = options.concat(
      actions.map(action => {
        return getActionDescription(action);
      })
    );
  }

  const style: CSSProperties = {
    ...commonCss(props),
    width: "100%",
    height: "100%",
    textAlignLast: "center",
    cursor: disabled ? "not-allowed" : "default"
  };

  const mappedOptions = options.map((text, index): JSX.Element => {
    return (
      <option
        key={index}
        value={index}
        disabled={index === 0 && text === label}
      >
        {text}
      </option>
    );
  });

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
      style={style}
      onChange={event => {
        props.onChange(
          actions[parseFloat(event.currentTarget.value) - displayOffset]
        );
      }}
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
  actionsFromPv: boolean;
  actions?: WidgetActions;
  label?: string;
  foregroundColor?: Color;
  backgroundColor?: Color;
  border?: Border;
}): JSX.Element => {
  const files = useContext(FileContext);
  // Function to send the value on to the PV
  function onChange(action: WidgetAction): void {
    // The value from the select element is an integer as a string,
    // so we parse it into a float.
    executeAction(action, files);
  }

  return (
    <MenuButtonComponent
      pvName={props.pvName}
      connected={props.connected}
      value={props.value}
      readonly={props.readonly}
      actionsFromPv={props.actionsFromPv}
      actions={props.actions}
      onChange={onChange}
      label={props.label}
      foregroundColor={props.foregroundColor}
      backgroundColor={props.backgroundColor}
    />
  );
};

const MenuButtonWidgetProps = {
  ...PVWidgetPropType,
  actionsFromPv: BoolProp,
  label: StringPropOpt,
  foregroundColor: ColorPropOpt,
  backgroundColor: ColorPropOpt
};

export const MenuButton = (
  props: InferWidgetProps<typeof MenuButtonWidgetProps>
): JSX.Element => <Widget baseWidget={SmartMenuButton} {...props} />;

registerWidget(MenuButton, MenuButtonWidgetProps, "menubutton");
