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
  visible: BoolPropOpt,
  stretchToFit: BoolPropOpt
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

  const useSizeProperties = !props.showLabel || props.stretchToFit;
  const sizeProps = {
    width: useSizeProperties ? `${props.width}px` : undefined,
    height: useSizeProperties ? `${props.height}px` : undefined
  };

  return (
    <div
      style={{
        backgroundColor: "transparent"
      }}
    >
      <ImageComponent
        {...{
          ...props,
          ...sizeProps
        }}
      />
      {showLabel && (
        <LabelComponent
          {...{ visible, backgroundColor: background, ...props }}
          text={props.value?.getStringValue() ?? ""}
          // TODO: This is pretty hacky, on CS-Studio when using stretchToFit
          // the text stays still while the image expands underneath, to compensate
          // for expansion of the image the text is shifted a FIXED amount
          transform={`translate(0px, ${props.stretchToFit ? -20 : 0}px)`}
          transparent={true}
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
