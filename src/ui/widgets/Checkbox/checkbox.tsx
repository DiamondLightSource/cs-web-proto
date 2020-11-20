import React, { useState } from "react";
import { commonCss, Widget } from "../widget";
import {
  InferWidgetProps,
  StringPropOpt,
  FloatPropOpt,
  FontPropOpt,
  ColorPropOpt
} from "../propTypes";
import { PVComponent, PVWidgetPropType } from "../widgetProps";
import { registerWidget } from "../register";

export const CheckboxProps = {
  label: StringPropOpt,
  width: FloatPropOpt,
  height: FloatPropOpt,
  font: FontPropOpt,
  foregroundColor: ColorPropOpt
};

export type CheckboxComponentProps = InferWidgetProps<typeof CheckboxProps> &
  PVComponent;

/**
 * Checkbox component, aka a toggleable component that places a tick
 * inside it when toggled. Allows for a label to be placed to the right of
 * the checkbox
 * @param props CheckboxComponentProps, optional parameters on top of the normal
 * widget parameters are: the label, the width, the height, the font, and the foreground color
 */
export const CheckboxComponent = (
  props: CheckboxComponentProps
): JSX.Element => {
  const style = {
    ...commonCss(props as any),
    display: "flex",
    alignItems: "center",
    cursor: "pointer"
  };

  const [checked, setChecked] = useState(true);

  const toggle = (): void => {
    setChecked(!checked);
  };
  const inp = (
    <input
      style={{ cursor: "inherit" }}
      id="cb"
      type="checkbox"
      checked={checked}
      readOnly={true}
    />
  );

  return (
    <form onClick={toggle} style={style}>
      {inp}
      <label style={{ cursor: "inherit" }}>{props.label}</label>
    </form>
  );
};

const CheckboxWidgetProps = {
  ...CheckboxProps,
  ...PVWidgetPropType
};

export const Checkbox = (
  props: InferWidgetProps<typeof CheckboxWidgetProps>
): JSX.Element => <Widget baseWidget={CheckboxComponent} {...props} />;

registerWidget(Checkbox, CheckboxWidgetProps, "checkbox");
