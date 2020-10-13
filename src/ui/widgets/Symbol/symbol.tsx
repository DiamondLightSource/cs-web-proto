import React from "react";

import { Widget } from "../widget";
import { PVWidgetPropType, PVComponent } from "../widgetProps";
import {
  InferWidgetProps,
  BoolPropOpt,
  StringPropOpt,
  ColorPropOpt,
  PositionProp
} from "../propTypes";
import { registerWidget } from "../register";
import { ImageComponent } from "../Image/image";
import { LabelComponent } from "../Label/label";

const SymbolProps = {
  src: StringPropOpt,
  alt: StringPropOpt,
  fill: BoolPropOpt,
  width: StringPropOpt,
  name: StringPropOpt,
  backgroundColor: ColorPropOpt,
  position: PositionProp
};

export type SymbolComponentProps = InferWidgetProps<typeof SymbolProps> &
  PVComponent;

export const SymbolComponent = (props: SymbolComponentProps): JSX.Element => {
  const { name } = props;
  return (
    <div
      style={{
        backgroundColor: props.backgroundColor?.rgbaString() || "white"
      }}
    >
      <ImageComponent {...props} />
      <LabelComponent {...props} text={name} />
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
