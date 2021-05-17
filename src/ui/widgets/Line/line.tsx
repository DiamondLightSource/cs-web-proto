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

const LineProps = {
  width: FloatProp,
  lineWidth: FloatPropOpt,
  backgroundColor: ColorPropOpt,
  visible: BoolPropOpt,
  transparent: BoolPropOpt,
  rotationAngle: FloatPropOpt
};

export type LineComponentProps = InferWidgetProps<typeof LineProps> &
  PVComponent;

export const LineComponent = (props: LineComponentProps): JSX.Element => {
  const {
    visible = true,
    transparent = false,
    backgroundColor,
    rotationAngle = 0,
    width,
    lineWidth = 1
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

const LineWidgetProps = {
  ...LineProps,
  ...PVWidgetPropType
};

export const Line = (
  props: InferWidgetProps<typeof LineWidgetProps>
): JSX.Element => <Widget baseWidget={LineComponent} {...props} />;

registerWidget(Line, LineWidgetProps, "line");
