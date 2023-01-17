import { Axis } from "../../../types/axes";
import { Color } from "../../../types/color";
import { DType } from "../../../types/dtypes";
import { Font, FontStyle } from "../../../types/font";
import { Traces } from "../../../types/traces";
import {
  calculateAxisLimits,
  createAxes,
  createTraces,
  roundValue
} from "./xyPlotOptions";

const DATA = [0, 3, 4, 8];
const ARRAY_DATA = new DType({
  arrayValue: new Float32Array(DATA)
});

describe("round values", (): void => {
  test("returns zero if values zero", (): void => {
    const rounded = roundValue(0, 0);

    expect(rounded).toEqual(0);
  });

  test("rounds down if roundType 0", (): void => {
    const rounded = roundValue(7.5, 0);

    expect(rounded).toBeLessThan(7.5);
  });

  test("rounds up if roundType 1", (): void => {
    const rounded = roundValue(7.5, 1);

    expect(rounded).toBeGreaterThan(7.5);
  });

  test("rounds to first significant figure", (): void => {
    const rounded1Sf = roundValue(64, 1);
    const rounded2Sf = roundValue(5.6, 1);
    const rounded3Sf = roundValue(3.789, 1);
    const rounded4Sf = roundValue(0.23, 1);
    const rounded5Sf = roundValue(0.045, 1);
    const rounded6Sf = roundValue(0.0084, 1);
    const rounded7Sf = roundValue(-0.00021, 0);

    expect(rounded1Sf).toEqual(70);
    expect(rounded2Sf).toEqual(6);
    expect(rounded3Sf).toEqual(4);
    expect(rounded4Sf).toEqual(0.3);
    expect(rounded5Sf).toEqual(0.05);
    expect(rounded6Sf).toEqual(0.009);
    expect(rounded7Sf).toEqual(-0.0003);
  });
});

describe("calculate axis limits", (): void => {
  test("Use set limits if autoscale false", (): void => {
    // here i need to create a new axis options with range
    // and an old axis options with the properties i need
    const oldAxisOpts: any = { autoScale: false };
    let newAxisOpts: any = { range: [1, 10] };
    const data: any[] = [{ x: [0, 3, 4] }, { x: [5, 4, 1] }];
    newAxisOpts = calculateAxisLimits(oldAxisOpts, newAxisOpts, data);

    expect(newAxisOpts.range).toEqual([1, 10]);
  });

  test("Use set limits if autoscale threshold not exceeded", (): void => {
    const oldAxisOpts: any = { autoScale: true, autoScaleThreshold: 0.99 };
    let newAxisOpts: any = { range: [1, 10] };
    const data: any[] = [{ x: [0, 3, 4] }, { x: [5, 4, 1] }];
    newAxisOpts = calculateAxisLimits(oldAxisOpts, newAxisOpts, data);

    expect(newAxisOpts.range).toEqual([1, 10]);
  });

  test("Use autoscale if autoscale threshold exceeded", (): void => {
    const oldAxisOpts: any = { autoScale: true, autoScaleThreshold: 0.01 };
    let newAxisOpts: any = { range: [1, 10] };
    const data: any[] = [{ x: [0, 3, 4] }, { x: [5, 4, 1] }];
    newAxisOpts = calculateAxisLimits(oldAxisOpts, newAxisOpts, data);

    expect(newAxisOpts.range).toEqual([0, 5]);
  });

  test("Set axis limits for x", (): void => {
    const oldAxisOpts: any = {
      autoScale: true,
      autoScaleThreshold: 0.95,
      yAxis: false,
      index: 0
    };
    let newAxisOpts: any = { range: [1, 10] };
    const data: any[] = [
      { x: [0, 3, 4], y: [11, 32, 40.3] },
      { x: [5, 4, 1], y: [16, 29.5, 45] }
    ];
    newAxisOpts = calculateAxisLimits(oldAxisOpts, newAxisOpts, data);

    expect(newAxisOpts.range).toEqual([1, 10]);
  });

  test("Set axis limits for y", (): void => {
    const oldAxisOpts: any = {
      autoScale: true,
      autoScaleThreshold: 0.95,
      yAxis: true,
      index: 1
    };
    let newAxisOpts: any = { range: [1, 100] };
    const data: any[] = [
      { x: [0, 3, 4], y: [11, 32, 40.3] },
      { x: [5, 4, 1], y: [16, 29.5, 45] }
    ];
    newAxisOpts = calculateAxisLimits(oldAxisOpts, newAxisOpts, data);

    expect(newAxisOpts.range).toEqual([1, 100]);
  });
});

describe("Create trace options object", (): void => {
  test("Return empty array if no data", (): void => {
    const traces: Traces = { count: 0, pvName: "test", traceOptions: [] };
    const val = new DType({ stringValue: "3.141", arrayValue: undefined });
    const bytesPerElement = 4;
    const traceOptions = createTraces(traces, val, bytesPerElement);

    expect(traceOptions).toEqual([]);
  });

  test("Create bar chart trace", (): void => {
    const traces: Traces = {
      count: 1,
      pvName: "test",
      traceOptions: [
        {
          index: 0,
          traceColor: new Color("rgb(255, 0, 0)"),
          pointStyle: 0,
          pointSize: 2,
          traceType: 3
        }
      ]
    };
    const bytesPerElement = 4;
    const traceOptions = createTraces(traces, ARRAY_DATA, bytesPerElement);

    expect(traceOptions).toEqual([
      {
        marker: {
          color: "rgb(255, 0, 0)",
          size: 2,
          symbol: "none"
        },
        type: "bar",
        x: [0, 1, 2, 3],
        y: [0, 3, 4, 8]
      }
    ]);
  });

  test("Create line plot trace", (): void => {
    const traces: Traces = {
      count: 1,
      pvName: "test",
      traceOptions: [
        {
          index: 0,
          traceColor: new Color("rgb(250, 0, 0)"),
          lineWidth: 2,
          pointStyle: 3,
          pointSize: 6,
          traceType: 2
        }
      ]
    };
    const bytesPerElement = 4;
    const traceOptions = createTraces(traces, ARRAY_DATA, bytesPerElement);

    expect(traceOptions).toEqual([
      {
        line: {
          color: "rgb(250, 0, 0)",
          width: 2
        },
        marker: {
          color: "rgb(250, 0, 0)",
          size: 6,
          symbol: "triangle-up"
        },
        mode: "markers",
        type: "scatter",
        x: [0, 1, 2, 3],
        y: [0, 3, 4, 8]
      }
    ]);
  });

  test("Create area plot trace", (): void => {
    const traces: Traces = {
      count: 1,
      pvName: "test",
      traceOptions: [
        {
          index: 0,
          traceColor: new Color("rgb(250, 0, 0)"),
          lineWidth: 2,
          pointStyle: 6,
          pointSize: 6,
          traceType: 4
        }
      ]
    };
    const bytesPerElement = 4;
    const traceOptions = createTraces(traces, ARRAY_DATA, bytesPerElement);

    expect(traceOptions).toEqual([
      {
        line: {
          color: "rgb(250, 0, 0)",
          width: 2
        },
        marker: {
          color: "rgb(250, 0, 0)",
          size: 6,
          symbol: "diamond-open"
        },
        fill: "tonexty",
        fillcolor: "rgb(250, 0, 0)",
        mode: "lines",
        type: "scatter",
        x: [0, 1, 2, 3],
        y: [0, 3, 4, 8]
      }
    ]);
  });

  /*
  test("Concatenate new data onto old", (): void => {
    // TO DO - when concatenation works, add test
  });*/

  test("Cut data down to buffer size, last n points", (): void => {
    const traces: Traces = {
      count: 1,
      pvName: "test",
      traceOptions: [
        {
          index: 0,
          traceColor: new Color("rgb(250, 0, 0)"),
          lineWidth: 2,
          pointStyle: 3,
          pointSize: 6,
          traceType: 2,
          bufferSize: 12,
          plotMode: 0
        }
      ]
    };
    const bytesPerElement = 4;
    const traceOptions = createTraces(traces, ARRAY_DATA, bytesPerElement);

    expect(traceOptions).toEqual([
      {
        line: {
          color: "rgb(250, 0, 0)",
          width: 2
        },
        marker: {
          color: "rgb(250, 0, 0)",
          size: 6,
          symbol: "triangle-up"
        },
        mode: "markers",
        type: "scatter",
        x: [1, 2, 3],
        y: [3, 4, 8]
      }
    ]);
  });

  test("Cut data down to buffer size, first n points", (): void => {
    const traces: Traces = {
      count: 1,
      pvName: "test",
      traceOptions: [
        {
          index: 0,
          traceColor: new Color("rgb(250, 0, 0)"),
          lineWidth: 2,
          pointStyle: 3,
          pointSize: 6,
          traceType: 2,
          bufferSize: 12,
          plotMode: 1
        }
      ]
    };
    const bytesPerElement = 4;
    const traceOptions = createTraces(traces, ARRAY_DATA, bytesPerElement);

    expect(traceOptions).toEqual([
      {
        line: {
          color: "rgb(250, 0, 0)",
          width: 2
        },
        marker: {
          color: "rgb(250, 0, 0)",
          size: 6,
          symbol: "triangle-up"
        },
        mode: "markers",
        type: "scatter",
        x: [0, 1, 2],
        y: [0, 3, 4]
      }
    ]);
  });
});

describe("Create axis options object", (): void => {
  test("Create axis without title label", (): void => {
    const axes: Axis[] = [
      {
        index: 0,
        axisTitle: "",
        visible: true,
        showGrid: true,
        dashGridLine: false,
        axisColor: new Color("rgb(255, 255, 255"),
        minimum: 1,
        maximum: 10
      }
    ];
    const font = new Font(10, FontStyle.Regular, "sans");
    const axisOptions = createAxes(axes, font.css());

    expect(axisOptions).toEqual([
      {
        automargin: true,
        autorange: false,
        gridcolor: "rgb(255, 255, 255",
        griddash: false,
        gridwidth: 0.5,
        minor: { ticks: "outside" },
        range: [1, 10],
        showgrid: true,
        showline: true,
        tickcolor: "rgb(255, 255, 255",
        visible: true,
        zeroline: false
      }
    ]);
  });

  test("Create axis with title label", (): void => {
    const axes: Axis[] = [
      {
        index: 0,
        axisTitle: "Test Plot",
        visible: true,
        showGrid: true,
        dashGridLine: false,
        axisColor: new Color("rgb(255, 255, 255"),
        minimum: 1,
        maximum: 10
      }
    ];
    const font = new Font(10, FontStyle.Regular, "sans");
    const axisOptions = createAxes(axes, font.css());

    expect(axisOptions).toEqual([
      {
        automargin: true,
        autorange: false,
        gridcolor: "rgb(255, 255, 255",
        griddash: false,
        gridwidth: 0.5,
        minor: { ticks: "outside" },
        range: [1, 10],
        showgrid: true,
        showline: true,
        tickcolor: "rgb(255, 255, 255",
        title: {
          standoff: 0,
          text: "Test Plot"
        },
        titlefont: {
          family: "sans,sans-serif",
          size: "1rem"
        },
        visible: true,
        zeroline: false
      }
    ]);
  });

  test("Shift axis if additional y axis", (): void => {
    const axis = {
      index: 0,
      axisTitle: "Test Plot",
      visible: true,
      showGrid: true,
      dashGridLine: false,
      axisColor: new Color("rgb(255, 255, 255"),
      minimum: 1,
      maximum: 10
    };
    const axis1 = { ...axis };
    axis1.index = 1;
    axis1.minimum = -5;
    const axis2 = { ...axis };
    axis2.index = 2;
    axis2.maximum = 50;
    const axes: Axis[] = [axis, axis1, axis2];
    const font = new Font(10, FontStyle.Regular, "sans");
    const axisOptions = createAxes(axes, font.css());

    // Check that third axis has shifted
    expect(axisOptions[2]).toEqual({
      anchor: "free",
      automargin: true,
      autorange: false,
      gridcolor: "rgb(255, 255, 255",
      griddash: false,
      gridwidth: 0.5,
      minor: { ticks: "outside" },
      overlaying: "y",
      position: 0,
      range: [1, 50],
      showgrid: true,
      showline: true,
      side: "left",
      tickcolor: "rgb(255, 255, 255",
      title: {
        standoff: 0,
        text: "Test Plot"
      },
      titlefont: {
        family: "sans,sans-serif",
        size: "1rem"
      },
      visible: true,
      zeroline: false
    });
  });
});
