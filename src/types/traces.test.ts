import { Color } from "./color";
import { Traces, Trace } from "./traces";

describe("Traces", () => {
  it("creates the traces object", (): void => {
    const traceList: Trace[] = [
      {
        name: "trace 1",
        plotMode: 1,
        lineWidth: 2,
        traceType: 2,
        traceColor: new Color("rgba(255,0,0,255)"),
        pointStyle: 1,
        pointSize: 2,
        concatenateData: false,
        visible: true
      },
      {
        name: "trace 2",
        plotMode: 1,
        lineWidth: 2,
        traceType: 2,
        traceColor: new Color("rgba(255,255,255)"),
        pointStyle: 4,
        pointSize: 2,
        concatenateData: false,
        visible: true
      }
    ];
    const traces = new Traces(2, "test", traceList);
    expect(traces).toEqual({
      count: 2,
      pvName: "test",
      traceOptions: [
        {
          name: "trace 1",
          plotMode: 1,
          lineWidth: 2,
          traceType: 2,
          traceColor: new Color("rgba(255,0,0,255)"),
          pointStyle: 1,
          pointSize: 2,
          concatenateData: false,
          visible: true
        },
        {
          name: "trace 2",
          plotMode: 1,
          lineWidth: 2,
          traceType: 2,
          traceColor: new Color("rgba(255,255,255)"),
          pointStyle: 4,
          pointSize: 2,
          concatenateData: false,
          visible: true
        }
      ]
    });
  });
  it("throw error if count different to number of traces", (): void => {
    const traceList: Trace[] = [
      {
        name: "trace 3",
        plotMode: 2,
        lineWidth: 3,
        traceType: 2,
        traceColor: new Color("rgba(255,0,0,255)"),
        pointStyle: 1,
        pointSize: 2,
        concatenateData: true,
        visible: true
      }
    ];
    expect(() => {
      new Traces(2, "test", traceList);
    }).toThrow(Error("Count 2 is not equal to number of traces 1"));
  });
});

describe("Trace", () => {
  it("construct the trace with values", (): void => {
    type TempClass = {
      [key: string]: any;
    };
    const baseObj: TempClass = {};
    baseObj.index = 0;
    baseObj.name = "trace 4";
    baseObj.plotMode = 2;
    baseObj.lineWidth = 5;
    baseObj.traceType = 1;
    baseObj.traceColor = new Color("rgb(255, 254, 253");
    baseObj.updateDelay = 50;
    baseObj.updateMode = 3;
    baseObj.pointStyle = 5;
    baseObj.pointSize = 3;
    baseObj.concatenateData = false;
    baseObj.bufferSize = 1000;
    baseObj.visible = true;
    baseObj.xPv = "xPvTest";
    baseObj.xPvValue = 5;
    baseObj.xAxisIndex = 0;
    baseObj.yPv = "yPvTest";
    baseObj.yPvValue = 4;
    baseObj.yAxisIndex = 1;

    // Construct trace from base object
    const trace = Object.assign(new Trace(), baseObj);

    expect(trace).toEqual({
      index: 0,
      name: "trace 4",
      plotMode: 2,
      lineWidth: 5,
      traceType: 1,
      traceColor: new Color("rgb(255, 254, 253"),
      updateDelay: 50,
      updateMode: 3,
      pointStyle: 5,
      pointSize: 3,
      concatenateData: false,
      bufferSize: 1000,
      visible: true,
      xPv: "xPvTest",
      xPvValue: 5,
      xAxisIndex: 0,
      yPv: "yPvTest",
      yPvValue: 4,
      yAxisIndex: 1
    });
    expect(trace).toBeInstanceOf(Trace);
  });

  it("construct the trace with only defaults", (): void => {
    type TempClass = {
      [key: string]: any;
    };
    const baseObj: TempClass = {};
    // Construct trace from base object
    const trace = Object.assign(new Trace(), baseObj);

    expect(trace).toEqual({
      index: 0,
      name: "",
      plotMode: 0,
      lineWidth: 1,
      traceType: 0,
      traceColor: new Color("rgb(255, 255, 255"),
      updateDelay: 100,
      updateMode: 0,
      pointStyle: 0,
      pointSize: 4,
      concatenateData: true,
      bufferSize: 100,
      visible: true,
      xPv: undefined,
      xPvValue: undefined,
      xAxisIndex: 0,
      yPv: undefined,
      yPvValue: undefined,
      yAxisIndex: 1
    });
    expect(trace).toBeInstanceOf(Trace);
  });
});
