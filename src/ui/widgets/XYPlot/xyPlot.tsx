import React, { CSSProperties } from "react";
import { Widget } from "../widget";
import {
  InferWidgetProps,
  ColorPropOpt,
  StringPropOpt,
  FontPropOpt,
  TracesPropOpt,
  AxesPropOpt,
  BoolPropOpt,
  FloatPropOpt
} from "../propTypes";
import { PVComponent, PVWidgetPropType } from "../widgetProps";
import { registerWidget } from "../register";
import Plot from "react-plotly.js";
import { calculateAxisLimits, createAxes, createTraces } from "./xyPlotOptions";

export const XYPlotProps = {
  height: FloatPropOpt,
  width: FloatPropOpt,
  plotBackgroundColor: ColorPropOpt,
  title: StringPropOpt,
  titleFont: FontPropOpt,
  showLegend: BoolPropOpt,
  showPlotBorder: BoolPropOpt,
  showToolbar: BoolPropOpt,
  traces: TracesPropOpt,
  axes: AxesPropOpt
};

export type XYPlotComponentProps = InferWidgetProps<typeof XYPlotProps> &
  PVComponent;

export const XYPlotComponent = (props: XYPlotComponentProps): JSX.Element => {
  const {
    height,
    width,
    value,
    plotBackgroundColor,
    title,
    titleFont,
    showLegend,
    showPlotBorder,
    // showToolbar, // TO DO - do we want a toolbar as well?
    traces,
    axes
  } = props;

  // TO DO - having all these checks is not ideal
  if (
    value?.value.arrayValue &&
    axes &&
    traces &&
    titleFont &&
    width &&
    height
  ) {
    // If data exists, creates traces to plot
    const dataSet = createTraces(traces, value);
    // Set up style
    let style: CSSProperties = {};
    if (showPlotBorder) {
      style = { border: "1px solid black", padding: "1px" };
    }
    const font = titleFont?.css();
    // Sometimes font is a string with "px" on the end....
    if (typeof font?.fontSize === "string") {
      // Convert string to number
      font.fontSize = parseFloat(font.fontSize.slice(0, -3)) * 10;
    }

    let newAxisOptions = createAxes(axes.axisOptions, font);
    newAxisOptions = calculateAxisLimits(newAxisOptions, dataSet);
    // Set up plot appearance
    const plotLayout: any = {
      margin: {
        t: 20,
        b: 5,
        l: 5,
        r: 5
      },
      overflow: "hidden",
      paper_bgcolor: plotBackgroundColor
        ? plotBackgroundColor.toString()
        : "white",
      plot_bgcolor: plotBackgroundColor
        ? plotBackgroundColor.toString()
        : "white",
      showlegend: showLegend,
      width: width - 5,
      height: height - 5,
      title: {
        text: title,
        font: {
          family: font ? font.fontFamily : "Liberation sans, sans-serif",
          size: font.fontSize ? font.fontSize : 12
        }
      },
      uirevision: 1 // This number needs to stay same to persist zoom on refresh
    };
    // TO DO - better way of coordinating axis names
    const axisNames = ["xaxis", "yaxis", "yaxis2", "yaxis3"];
    const len = newAxisOptions.length;
    for (let i = 0; i < len; i++) {
      plotLayout[axisNames[i]] = newAxisOptions.shift();
    }
    return (
      <div className={"showBorder"} style={style}>
        <Plot data={dataSet} layout={plotLayout} />
      </div>
    );
  }
  return <></>;
};

const XYPlotWidgetProps = {
  ...XYPlotProps,
  ...PVWidgetPropType
};

export const XYPlot = (
  props: InferWidgetProps<typeof XYPlotWidgetProps>
): JSX.Element => <Widget baseWidget={XYPlotComponent} {...props} />;

registerWidget(XYPlot, XYPlotWidgetProps, "xyplot");
