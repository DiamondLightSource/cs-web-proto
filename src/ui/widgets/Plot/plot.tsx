import React, { CSSProperties, useState } from "react";
import { LineChart, Line, XAxis, CartesianGrid } from "recharts";

import { Widget } from "../widget";
import { PVComponent, PVWidgetPropType } from "../widgetProps";
import { InferWidgetProps, IntProp, ObjectPropOpt } from "../propTypes";
import Plotly from "react-plotly.js";
import { PlotData } from "plotly.js";
import { registerWidget } from "../register";

const PlotProps = {
  data: ObjectPropOpt,
  width: IntProp,
  height: IntProp,
  mode: IntProp
};

const PlotWidgetProps = {
  ...PlotProps,
  ...PVWidgetPropType
};

type PlotComponentProps = InferWidgetProps<typeof PlotWidgetProps> &
  PVComponent;

type dataPoint = { x: number; y: number };

export const PlotComponent = (
  props: InferWidgetProps<PlotComponentProps>
): JSX.Element => {
  const dataPointSet: dataPoint[] = [];
  const data: Partial<PlotData> = {};
  data.type = "scatter";
  data.mode = "lines+markers";
  data.marker = { color: "#0000ff" };
  data.line = { shape: "hv" };
  const { value } = props;
  if (value) {
    const tmpX: number[] = [];
    const tmpY: number[] = [];
    value.value.arrayValue.forEach((val: number, ind: number) => {
      const tmpEl: dataPoint = { y: val, x: ind };
      dataPointSet.push(tmpEl);
      tmpX.push(ind);
      tmpY.push(val);
    });
    data.x = new Float64Array(tmpX);
    data.y = new Float64Array(tmpY);
  }
  const [layout, setLayout] = useState({});
  const style: CSSProperties = {
    textAlign: "center"
  };

  switch (props.mode) {
    case 1:
      return (
        <div style={style}>
          <LineChart
            data={dataPointSet}
            width={props.width}
            height={props.height}
          >
            <XAxis dataKey="name" />
            <CartesianGrid />
            <Line dataKey="y" />
          </LineChart>
        </div>
      );
    case 2:
      return (
        <div style={style}>
          <Plotly data={[data]} layout={layout} />
        </div>
      );
    case 3:
      return (
        <div style={style}>
          <img src={"http://localhost:8001"} />
        </div>
      );
    default:
      return <div style={style}>Please specify plot mode!</div>;
  }
};

export const Plot = (
  props: InferWidgetProps<typeof PlotWidgetProps>
): JSX.Element => <Widget baseWidget={PlotComponent} {...props} />;

registerWidget(Plot, PlotWidgetProps, "plot");
