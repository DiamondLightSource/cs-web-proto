import React from "react";

import { Widget } from "../widget";
import { PVWidgetPropType, PVComponent } from "../widgetProps";
import {
  InferWidgetProps,
  BoolPropOpt,
  StringPropOpt,
  ColorPropOpt,
  BoolProp,
  FloatPropOpt,
  BorderPropOpt,
  StringProp
} from "../propTypes";
import { registerWidget } from "../register";
import { LabelComponent } from "../Label/label";
import { Color } from "../../../types/color";
import { ImageComponent } from "../Image/image";

const SymbolProps = {
  src: StringProp,
  alt: StringPropOpt,
  backgroundColor: ColorPropOpt,
  showLabel: BoolProp,
  width: FloatPropOpt,
  height: FloatPropOpt,
  border: BorderPropOpt,
  value: FloatPropOpt,
  rotation: FloatPropOpt,
  flipHorizontal: BoolPropOpt,
  flipVertical: BoolPropOpt,
  visible: BoolPropOpt
};

export type SymbolComponentProps = InferWidgetProps<typeof SymbolProps> &
  PVComponent;

/**
 * This component combines the use of a svg with a label, and is used to replace
 * the MultistateMonitorWidget from CS-Studio
 * @param props
 */
export const SymbolComponent = (props: SymbolComponentProps): JSX.Element => {
  const { showLabel, visible = true } = props;
  const background = props.backgroundColor || Color.WHITE;

  return (
    <div
      style={{
        backgroundColor: "transparent"
      }}
    >
      <ImageComponent
        {...{
          ...props,
          width: !props.showLabel ? `${props.width}px` : undefined,
          height: !props.showLabel ? `${props.height}px` : undefined
        }}
      />
      {showLabel && (
        <LabelComponent
          {...{ visible, backgroundColor: background, ...props }}
          text={props.value?.getStringValue() ?? ""}
        />
      )}
    </div>
  );
};

const SymbolWidgetProps = {
  ...SymbolProps,
  ...PVWidgetPropType
};

export const Symbol = (
  props: InferWidgetProps<typeof SymbolWidgetProps>
): JSX.Element => <Widget baseWidget={SymbolComponent} {...props} />;

registerWidget(Symbol, SymbolWidgetProps, "symbol");
