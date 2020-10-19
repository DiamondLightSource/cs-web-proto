import React from "react";

import { Widget } from "../widget";
import { PVWidgetPropType, PVComponent } from "../widgetProps";
import { InferWidgetProps, PositionProp, FloatPropOpt } from "../propTypes";
import { registerWidget } from "../register";

const PolylineProps = {
  width: FloatPropOpt,
  position: PositionProp
};

export type PolylineComponentProps = InferWidgetProps<typeof PolylineProps> &
  PVComponent;

/**
 * This component combines the use of a svg with a label, and is used to replace
 * the MultistateMonitorWidget from CS-Studio
 * @param props
 */
export const PolylineComponent = (
  props: PolylineComponentProps
): JSX.Element => {
  console.log(props);
  return <div>{"hi"}</div>;
};

const PolylineWidgetProps = {
  ...PolylineProps,
  ...PVWidgetPropType
};

export const Polyline = (
  props: InferWidgetProps<typeof PolylineWidgetProps>
): JSX.Element => <Widget baseWidget={PolylineComponent} {...props} />;

registerWidget(Polyline, PolylineWidgetProps, "polyline");
