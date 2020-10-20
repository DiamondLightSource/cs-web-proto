import React, { useState } from "react";
import { Widget } from "../widget";
import { InferWidgetProps, StringPropOpt, FloatPropOpt } from "../propTypes";
import { PVComponent, PVWidgetPropType } from "../widgetProps";
import { registerWidget } from "../register";
import { Checkbox as MaterialCheckbox } from "@material-ui/core";
import FormControlLabel from "@material-ui/core/FormControlLabel";

export const CheckboxProps = {
  label: StringPropOpt,
  width: FloatPropOpt,
  height: FloatPropOpt
};

export type CheckboxComponentProps = InferWidgetProps<typeof CheckboxProps> &
  PVComponent;

export const CheckboxComponent = (
  props: CheckboxComponentProps
): JSX.Element => {
  const [checked, setChecked] = useState(false);

  const toggle = (): void => {
    setChecked(!checked);
  };

  return (
    <div>
      <FormControlLabel
        control={
          <MaterialCheckbox
            checked={checked}
            onChange={toggle}
            name="checkedB"
            color="primary"
          />
        }
        label="Primary"
      />
      ;
    </div>
  );
};

const LedWidgetProps = {
  ...CheckboxProps,
  ...PVWidgetPropType
};

export const Checkbox = (
  props: InferWidgetProps<typeof LedWidgetProps>
): JSX.Element => <Widget baseWidget={CheckboxComponent} {...props} />;

registerWidget(Checkbox, LedWidgetProps, "checkbox");
