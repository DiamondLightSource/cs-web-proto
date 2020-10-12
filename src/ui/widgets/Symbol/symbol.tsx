import React from "react";

import { Widget } from "../widget";
import { WidgetPropType } from "../widgetProps";
import {
  InferWidgetProps,
  StringProp,
  BoolPropOpt,
  StringPropOpt,
  ColorPropOpt
} from "../propTypes";
import { registerWidget } from "../register";
import { ImageComponent } from "../Image/image";
import { LabelComponent } from "../Label/label";
import { GroupingContainerComponent } from "../GroupingContainer/groupingContainer";

const SymbolProps = {
  src: StringProp,
  alt: StringPropOpt,
  fill: BoolPropOpt,
  width: StringPropOpt,
  text: StringPropOpt,
  backgroundColor: ColorPropOpt
};

export const SymbolComponent = (
  props: InferWidgetProps<typeof SymbolProps>
): JSX.Element => {
  return (
    <GroupingContainerComponent name={"Grouping"} {...props}>
      <ImageComponent {...props} />
      <LabelComponent {...props} />
    </GroupingContainerComponent>
  );
};

const SymbolWidgetProps = {
  ...SymbolProps,
  ...WidgetPropType
};

export const Symbol = (
  props: InferWidgetProps<typeof SymbolWidgetProps>
): JSX.Element => <Widget baseWidget={SymbolComponent} {...props} />;

registerWidget(Symbol, SymbolWidgetProps, "symbol");
