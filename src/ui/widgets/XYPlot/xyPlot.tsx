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
import { Axes } from "../../../types/axes";
import { PVComponent, PVWidgetPropType } from "../widgetProps";
import { registerWidget } from "../register";
import Plot from "react-plotly.js";

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
    showToolbar,
    traces,
    axes
  } = props;
  const font = titleFont?.css();
  let fontSize = 10;
  if (typeof font?.fontSize === "string") {
    // weird stuff to convert it back to number we need
    fontSize = parseFloat(font.fontSize.slice(0, -3)) * 10;
  } else if (font?.fontSize) {
    fontSize = font?.fontSize;
  }
  // fontsize could be string or number

  const fakeData: any[] = [
    {
      name: "dataset1",
      x: [0, 1, 2, 3, 4, 5],
      y: [10, 15, 17, 19, 25],
      type: "scatter",
      mode: "lines",
      marker: {
        color: "red",
        symbol: "circle"
      }
    }
  ];
  if (axes && traces && titleFont && plotBackgroundColor) {
    return (
      <Plot
        data={fakeData}
        layout={{
          margin: {
            t: 20,
            b: 5
          },
          paper_bgcolor: plotBackgroundColor.toString(),
          plot_bgcolor: plotBackgroundColor.toString(),
          showlegend: showLegend,
          width: width,
          height: height,
          title: {
            text: `<b>${title}</b>`,
            font: {
              family: font?.fontFamily,
              size: fontSize
            }
          },
          xaxis: {
            showline: true,
            visible: true,
            showgrid: axes.axisOptions[0].showGrid,
            gridwidth: 0.5,
            gridcolor: axes.axisOptions[0].axisColor?.toString(),
            tickcolor: axes.axisOptions[0].axisColor?.toString(),
            zeroline: false,
            automargin: true,
            title: {
              text: axes.axisOptions[0].axisTitle
                ? axes.axisOptions[0].axisTitle
                : "X",
              standoff: 0
            },
            titlefont: {
              family: font?.fontFamily,
              size: fontSize
            }
          },
          yaxis: {
            showline: true,
            showgrid: axes.axisOptions[1].showGrid,
            gridwidth: 0.5,
            gridcolor: axes.axisOptions[0].axisColor?.toString(),
            tickcolor: axes.axisOptions[0].axisColor?.toString(),
            zeroline: false,
            automargin: true,
            title: {
              text: axes.axisOptions[0].axisTitle
                ? axes.axisOptions[0].axisTitle
                : "Y",
              standoff: 0
            },
            titlefont: {
              family: font?.fontFamily,
              size: fontSize
            }
          }
        }}
      />
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
