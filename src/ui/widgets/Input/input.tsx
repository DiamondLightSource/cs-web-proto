import React from "react";

import classes from "./input.module.css";
import { writePv } from "../../hooks/useSubscription";
import { commonCss, Widget } from "../widget";
import { PVInputComponent, PVWidgetPropType } from "../widgetProps";
import { registerWidget } from "../register";
import {
  InferWidgetProps,
  FontPropOpt,
  ChoicePropOpt,
  ColorPropOpt,
  BoolPropOpt
} from "../propTypes";
import { Font } from "../../../types/font";
import { Color } from "../../../types/color";
import { AlarmQuality, DType } from "../../../types/dtypes";
import { InputComponent } from "../../components/input/input";

export interface InputProps {
  pvName: string;
  value: string;
  readonly: boolean;
  foregroundColor?: Color;
  backgroundColor?: Color;
  transparent: boolean;
  alarm: AlarmQuality;
  alarmSensitive: boolean;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClick: (event: React.MouseEvent<HTMLInputElement>) => void;
  font?: Font;
  textAlign?: "left" | "center" | "right";
}

export const SmartInputComponent = (
  props: PVInputComponent & {
    font?: Font;
    foregroundColor?: Color;
    backgroundColor?: Color;
    transparent?: boolean;
    alarmSensitive?: boolean;
    textAlign?: "left" | "center" | "right";
  }
): JSX.Element => {
  const alarmQuality = props.value?.getAlarm().quality ?? AlarmQuality.VALID;
  let allClasses = classes.Input;
  const style = commonCss(props);
  if (props.textAlign) {
    style.textAlign = props.textAlign;
  }
  style.color = props.foregroundColor?.toString();
  style.backgroundColor = props.backgroundColor?.toString();
  // Transparent prop overrides backgroundColor.
  if (props.transparent) {
    style["backgroundColor"] = "transparent";
  }
  if (props.readonly) {
    allClasses += ` ${classes.readonly}`;
  }
  if (props.alarmSensitive) {
    switch (alarmQuality) {
      case AlarmQuality.UNDEFINED:
      case AlarmQuality.INVALID:
      case AlarmQuality.CHANGING:
        style.color = "var(--invalid)";
        break;
      case AlarmQuality.WARNING:
        style.color = "var(--alarm)";
        break;
      case AlarmQuality.ALARM:
        style.color = "var(--alarm)";
        break;
    }
  }
  function onEnter(value: string): void {
    writePv(props.pvName, new DType({ stringValue: value }));
  }

  return (
    <InputComponent
      value={DType.coerceString(props.value)}
      readonly={props.readonly}
      onEnter={onEnter}
      style={style}
      className={allClasses}
    />
  );
};

const InputWidgetProps = {
  ...PVWidgetPropType,
  font: FontPropOpt,
  foregroundColor: ColorPropOpt,
  backgroundColor: ColorPropOpt,
  transparent: BoolPropOpt,
  alarmSensitive: BoolPropOpt,
  textAlign: ChoicePropOpt(["left", "center", "right"])
};

export const Input = (
  props: InferWidgetProps<typeof InputWidgetProps>
): JSX.Element => <Widget baseWidget={SmartInputComponent} {...props} />;

registerWidget(Input, InputWidgetProps, "input");
