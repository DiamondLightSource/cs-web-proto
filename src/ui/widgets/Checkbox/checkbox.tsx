import React, { useState } from "react";
import { Widget } from "../widget";
import { InferWidgetProps, StringPropOpt, FloatPropOpt } from "../propTypes";
import { PVComponent, PVWidgetPropType } from "../widgetProps";
import { registerWidget } from "../register";
import { Checkbox as MaterialCheckbox } from "@material-ui/core";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { makeStyles } from "@material-ui/core/styles";
import { LabelComponent } from "../Label/label";

export const CheckboxProps = {
  label: StringPropOpt,
  width: FloatPropOpt,
  height: FloatPropOpt
};

export type CheckboxComponentProps = InferWidgetProps<typeof CheckboxProps> &
  PVComponent;

/**
 * This removes some of the frills of the default material ui checkbox, e.g.
 * the animations when it is clicked, as well as the circular background when
 * the cursor is hovered over it
 */
const useStyles = makeStyles(() => ({
  root: {
    // Edit this to change the unchecked border color
    color: "#000000",
    "&:hover": {
      backgroundColor: "transparent"
    },
    "&$checked": {
      // Edit this to change the checked color
      color: "#000000",
      "&:hover": {
        backgroundColor: "transparent"
      }
    }
  },
  checked: {}
}));

/**
 * Checkbox component, aka a toggleable component that places a tick
 * inside it when toggled. Allows for a label to be placed to the right of
 * the checkbox
 * @param props CheckboxComponentProps, optional parameters on top of the normal
 * widget parameters are: the label, the width, and the height
 */
export const CheckboxComponent = (
  props: CheckboxComponentProps
): JSX.Element => {
  const { label, width = 10, height = 10 } = props;

  const [checked, setChecked] = useState(false);

  const toggle = (): void => {
    setChecked(!checked);
  };

  const classes = useStyles();

  return (
    <div>
      <FormControlLabel
        control={
          <MaterialCheckbox
            checked={checked}
            onChange={toggle}
            disableRipple
            classes={{
              root: classes.root,
              checked: classes.checked
            }}
          />
        }
        label={label && <LabelComponent text={label} />}
        style={{
          width: `${width}px`,
          height: `${height}px`
        }}
      />
    </div>
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
