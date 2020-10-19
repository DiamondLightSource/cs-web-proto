import React from "react";

import { Widget } from "../widget";
import { PVWidgetPropType, PVComponent } from "../widgetProps";
import { InferWidgetProps, PositionProp, FloatPropOpt } from "../propTypes";
import { registerWidget } from "../register";
import { ShapeComponent } from "../Shape/shape";
import { Color } from "../../../types/color";
import { Border, BorderStyle } from "../../../types/border";

const PolylineProps = {
  width: FloatPropOpt,
  position: PositionProp,
  lineWidth: FloatPropOpt
};

export type PolylineComponentProps = InferWidgetProps<typeof PolylineProps> &
  PVComponent;

export const PolylineComponent = (
  props: PolylineComponentProps
): JSX.Element => {
  const shapeProps = {
    shapeWidth: `${props.width}px`,
    shapeHeight: `${props.lineWidth}px`,
    backgroundColor: Color.CYAN
  };

  return <ShapeComponent {...shapeProps} />;
};

const PolylineWidgetProps = {
  ...PolylineProps,
  ...PVWidgetPropType
};

export const Polyline = (
  props: InferWidgetProps<typeof PolylineWidgetProps>
): JSX.Element => <Widget baseWidget={PolylineComponent} {...props} />;

registerWidget(Polyline, PolylineWidgetProps, "polyline");
