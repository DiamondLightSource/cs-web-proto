import { Axis } from "../../../types/axes";
import { PlotData } from "plotly.js";
import { Traces } from "../../../types/traces";
import type { DType } from "../../../types/dtypes";
import React from "react";

/**
 * Create traces containing data for each trace
 * specified.
 * @param traces trace configuration
 * @param value data from pv
 * @returns a list of PlotData traces
 */
export function createTraces(
  traces: Traces,
  value: DType
): Partial<PlotData>[] {
  const arrayValue = value.value.arrayValue;
  // TO DO - can format this better once I figure out confusing types
  if (!arrayValue) return [];
  const dataSet: Partial<PlotData>[] = [];
  traces.traceOptions.forEach(options => {
    // Create a dataset for each trace
    const data: Partial<PlotData> = {
      type: "scatter",
      mode: "lines+markers",
      line: {
        color: options.traceColor ? options.traceColor.toString() : "green",
        width: options.lineWidth ? options.lineWidth : 0.75
      },
      marker: {
        color: options.traceColor ? options.traceColor.toString() : "green",
        symbol: "circle",
        size: options.pointSize ? options.pointSize : 0.75
      }
    };
    const tmpX: number[] = [];
    const tmpY: number[] = [];
    arrayValue.forEach((val: any, ind: number) => {
      tmpX.push(ind);
      tmpY.push(val);
    });
    data.x = tmpX;
    data.y = tmpY;
    dataSet.push(data);
  });
  return dataSet;
}

/**
 * Create plotly axis object for each axisOptions
 * in the axes array.
 * @param axesList list of all the axes information
 * from the file
 * @returns a Plotly formatted axis object
 */
export function createAxes(axesList: Axis[], font: React.CSSProperties): any[] {
  const formattedAxes: any[] = [];
  let idx = 0;
  for (const axis of axesList) {
    // Define type so that we can add properties to object
    type AxisSettings = {
      [key: string]: any;
    };
    const _newAxis: AxisSettings = {
      autorange: true,
      showline: true,
      visible: axis.hasOwnProperty("visible") ? axis.visible : true,
      showgrid: axis.hasOwnProperty("showGrid") ? axis.showGrid : false,
      griddash: axis.hasOwnProperty("dashGridLine") ? axis.dashGridLine : false,
      gridwidth: 0.5,
      gridcolor: axis.axisColor ? axis.axisColor.toString() : "black",
      tickcolor: axis.axisColor ? axis.axisColor.toString() : "black",
      zeroline: false,
      automargin: true,
      minor: {
        ticks: "outside"
      }
    };
    // Only add title labels if they exist
    if (axis.hasOwnProperty("axisTitle")) {
      _newAxis.title = {
        text: axis.axisTitle,
        standoff: 0
      };
      _newAxis.titlefont = {
        family: font ? font.fontFamily : "Liberation sans, sans-serif",
        size: font.fontSize ? font.fontSize : 12
      };
    }
    if ("minimum" in axis && "maximum" in axis) {
      _newAxis.range = [axis.minimum, axis.maximum];
      _newAxis.autorange = false;
    }
    // Only shift to add space for 2nd y-axis if it is visible
    if (idx > 1 && axis.visible) {
      _newAxis.side = "left";
      _newAxis.overlaying = "y";
      _newAxis.position = 0;
      _newAxis.anchor = "free";
      formattedAxes[0].domain = [0.08 * (axesList.length - 1), 1];
    }
    formattedAxes.push(_newAxis);
    idx += 1;
  }
  return formattedAxes;
}

/**
 * Calculates the axis range within the maximum
 * and minimum limits using the highest and lowest
 * data values. Defaults to range specified from file
 * if calculated limits are larger.
 * @param axes list of axis options
 * @param dataSet array of PV data
 * @returns modified list of axis options
 */
export function calculateAxisLimits(axes: any[], dataSet: any[]): any[] {
  dataSet.forEach((data: any) => {
    for (let i = 0; i < axes.length; i++) {
      const [axMin, axMax] = axes[i].range;
      // Determine whether we want x or y data
      let axisData = data.y;
      if (i === 0) axisData = data.x;
      // Find min/max data points and round them to 1sf
      let min = roundValue(Math.min(...axisData), 0);
      let max = roundValue(Math.max(...axisData), 1);
      // If number is not within axis min and max, use axis limits
      if (typeof axMin === "number" && axMin > min) min = axMin;
      if (typeof axMax === "number" && axMax < max) max = axMax;
      axes[i].range = [min, max];
    }
  });
  return axes;
}

/**
 * Round a decimal value up or down to the nearest
 * significant figure.
 * @param value decimal value to round
 * @param mag magnitude to round to
 * @param roundType 0 to round down, 1 to round up
 * @returns rounded number
 */
function roundValue(value: number, roundType: number): number {
  // Can't find magnitude of 0 so skip
  if (value === 0) return value;
  // Need to use Math.abs to remove negative numbers
  const mag = Math.floor(Math.log(Math.abs(value)) / Math.log(10));
  // Round up or down depending on if it is max or min
  if (roundType) {
    return Math.ceil(value / Math.pow(10, mag)) * Math.pow(10, mag);
  }
  return Math.floor(value / Math.pow(10, mag)) * Math.pow(10, mag);
}
