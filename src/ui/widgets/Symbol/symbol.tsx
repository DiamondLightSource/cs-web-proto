import React, { useContext } from "react";

import { Widget } from "../widget";
import { PVWidgetPropType, PVComponent } from "../widgetProps";
import {
  InferWidgetProps,
  BoolPropOpt,
  StringPropOpt,
  ColorPropOpt,
  PositionProp,
  BoolProp,
  FloatPropOpt
} from "../propTypes";
import { registerWidget } from "../register";
import { LabelComponent } from "../Label/label";
import { BaseUrlContext } from "../../../baseUrl";

const SvgImageProps = {
  src: StringPropOpt,
  width: FloatPropOpt,
  height: FloatPropOpt,
  showLabel: BoolProp
};

const SvgImageComponent = (
  props: InferWidgetProps<typeof SvgImageProps>
): JSX.Element => {
  const baseUrl = useContext(BaseUrlContext);
  const file = `${baseUrl}/img/${props.src}`;

  const style: any = {};
  if (!props.showLabel) {
    style.width = `${props.width}px`;
    style.height = `${props.height}px`;
  }

  return (
    <div className="size">
      <img src={file} alt={""} style={style} />
    </div>
  );
};

const SymbolProps = {
  src: StringPropOpt,
  alt: StringPropOpt,
  fill: BoolPropOpt,
  name: StringPropOpt,
  backgroundColor: ColorPropOpt,
  position: PositionProp,
  showLabel: BoolProp,
  stretchToFit: BoolProp,
  width: FloatPropOpt,
  height: FloatPropOpt
};

export type SymbolComponentProps = InferWidgetProps<typeof SymbolProps> &
  PVComponent;

export const SymbolComponent = (props: SymbolComponentProps): JSX.Element => {
  const { name, showLabel } = props;

  return (
    <div
      style={{
        backgroundColor: props.backgroundColor?.rgbaString() || "white"
      }}
    >
      <SvgImageComponent {...props} />
      {showLabel && <LabelComponent {...props} text={name} />}
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
