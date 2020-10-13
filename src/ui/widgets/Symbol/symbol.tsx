import React, { useContext } from "react";

import { Widget } from "../widget";
import { PVWidgetPropType, PVComponent } from "../widgetProps";
import {
  InferWidgetProps,
  BoolPropOpt,
  StringPropOpt,
  ColorPropOpt,
  PositionProp,
  BoolProp
} from "../propTypes";
import { registerWidget } from "../register";
import { LabelComponent } from "../Label/label";
import { ImageComponent } from "../Image/image";

const SymbolProps = {
  src: StringPropOpt,
  alt: StringPropOpt,
  fill: BoolPropOpt,
  name: StringPropOpt,
  backgroundColor: ColorPropOpt,
  position: PositionProp,
  showLabel: BoolProp,
  stretchToFit: BoolProp
};

export type SymbolComponentProps = InferWidgetProps<typeof SymbolProps> &
  PVComponent;

export const SymbolComponent = (props: SymbolComponentProps): JSX.Element => {
  const { name, showLabel, stretchToFit } = props;

  return (
    <div
      style={{
        backgroundColor: props.backgroundColor?.rgbaString() || "white"
      }}
    >
      <ImageComponent {...props} />
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
