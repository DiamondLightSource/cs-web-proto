import React from "react";
import { Widget } from "../widget";
import { PVWidgetPropType, PVComponent } from "../widgetProps";
import {
  InferWidgetProps,
  FloatPropOpt,
  ColorPropOpt,
  BoolPropOpt,
  FloatProp
} from "../propTypes";
import { registerWidget } from "../register";
import { ShapeComponent } from "../Shape/shape";
import { Color } from "../../../types/color";

const PolylineProps = {
  width: FloatProp,
  lineWidth: FloatProp,
  backgroundColor: ColorPropOpt,
  visible: BoolPropOpt,
  transparent: BoolPropOpt,
  rotationAngle: FloatPropOpt
};

export type PolylineComponentProps = InferWidgetProps<typeof PolylineProps> &
  PVComponent;

export const PolylineComponent = (
  props: PolylineComponentProps
): JSX.Element => {
  const {
    visible = true,
    transparent = false,
    backgroundColor,
    rotationAngle = 0,
    width,
    lineWidth
  } = props;

  const styleProps = {
    backgroundColor: transparent ? Color.TRANSPARENT : backgroundColor,
    visible
  };

  const shapeProps = {
    shapeWidth: `${width}px`,
    shapeHeight: `${lineWidth}px`
  };

  const transform = `rotate(${rotationAngle}deg)`;

  return (
    <ShapeComponent
      {...{ ...shapeProps, ...styleProps }}
      shapeTransform={transform}
    />
  );
};

const PolylineWidgetProps = {
  ...PolylineProps,
  ...PVWidgetPropType
};

export const Polyline = (
  props: InferWidgetProps<typeof PolylineWidgetProps>
): JSX.Element => <Widget baseWidget={PolylineComponent} {...props} />;

registerWidget(Polyline, PolylineWidgetProps, "polyline");
