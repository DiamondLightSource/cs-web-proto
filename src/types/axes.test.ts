import { Color } from "./color";
import { Axes, Axis } from "./axes";
import { Font, FontStyle } from "./font";

describe("Axes", () => {
  it("creates the axes object", (): void => {
    const axesList: Axis[] = [
      {
        axisColor: new Color("rgb(256, 255, 254"),
        axisTitle: "X axis",
        showGrid: false,
        gridColor: new Color("rgb(256, 255, 254"),
        dashGridLine: false,
        titleFont: new Font(),
        visible: true,
        logScale: false,
        maximum: 10,
        minimum: 0
      },
      {
        axisColor: new Color("rgb(256, 255, 254"),
        axisTitle: "Y axis",
        showGrid: false,
        gridColor: new Color("rgb(256, 255, 254"),
        titleFont: new Font(),
        visible: true,
        logScale: false,
        maximum: 30,
        minimum: 15
      }
    ];
    const axes = new Axes(2, axesList);
    expect(axes).toEqual({
      count: 2,
      axisOptions: [
        {
          axisColor: new Color("rgb(256, 255, 254"),
          axisTitle: "X axis",
          showGrid: false,
          gridColor: new Color("rgb(256, 255, 254"),
          dashGridLine: false,
          titleFont: new Font(),
          visible: true,
          logScale: false,
          maximum: 10,
          minimum: 0
        },
        {
          axisColor: new Color("rgb(256, 255, 254"),
          axisTitle: "Y axis",
          showGrid: false,
          gridColor: new Color("rgb(256, 255, 254"),
          titleFont: new Font(),
          visible: true,
          logScale: false,
          maximum: 30,
          minimum: 15
        }
      ]
    });
  });
  it("throw error if count different to number of traces", (): void => {
    const axesList: Axis[] = [
      {
        axisColor: new Color("rgb(0, 0, 0"),
        axisTitle: "Z axis",
        showGrid: true,
        gridColor: new Color("rgb(0, 0, 0"),
        dashGridLine: false,
        titleFont: new Font(),
        visible: true,
        logScale: false,
        maximum: 10,
        minimum: 0
      }
    ];
    expect(() => {
      new Axes(3, axesList);
    }).toThrow(Error("Count 3 is not equal to number of axes 1"));
  });
});

describe("Axis", () => {
  it("construct the axis with values", (): void => {
    type TempClass = {
      [key: string]: any;
    };
    const baseObj: TempClass = {};
    baseObj.index = 1;
    baseObj.autoScale = false;
    baseObj.axisColor = new Color("rgb(255, 0, 0");
    baseObj.axisTitle = "Velocity";
    baseObj.showGrid = true;
    baseObj.gridColor = new Color("rgb(255, 0, 0");
    baseObj.dashGridLine = false;
    baseObj.timeFormat = 2;
    baseObj.scaleFormat = "0.0";
    baseObj.scaleFont = new Font(10, FontStyle.Bold, "Comic sans");
    baseObj.titleFont = new Font(10, FontStyle.Bold, "Comic sans");
    baseObj.visible = false;
    baseObj.logScale = true;
    baseObj.leftBottomSide = false;
    baseObj.maximum = 40;
    baseObj.minimum = 10;

    // Construct trace from base object
    const axis = Object.assign(new Axis(), baseObj);
    expect(axis).toEqual({
      index: 1,
      autoScale: false,
      axisColor: new Color("rgb(255, 0, 0"),
      axisTitle: "Velocity",
      showGrid: true,
      gridColor: new Color("rgb(255, 0, 0"),
      dashGridLine: false,
      timeFormat: 2,
      scaleFormat: "0.0",
      scaleFont: new Font(10, FontStyle.Bold, "Comic sans"),
      titleFont: new Font(10, FontStyle.Bold, "Comic sans"),
      visible: false,
      logScale: true,
      leftBottomSide: false,
      maximum: 40,
      minimum: 10
    });
    expect(axis).toBeInstanceOf(Axis);
  });

  it("construct the axis with only defaults", (): void => {
    type TempClass = {
      [key: string]: any;
    };
    const baseObj: TempClass = {};
    // Construct trace from base object
    const axis = Object.assign(new Axis(), baseObj);

    expect(axis).toEqual({
      index: 0,
      autoScale: true,
      axisColor: new Color("rgb(0, 0, 0"),
      axisTitle: "",
      showGrid: false,
      gridColor: new Color("rgb(0, 0, 0"),
      dashGridLine: true,
      timeFormat: 0,
      scaleFormat: "",
      scaleFont: new Font(),
      titleFont: new Font(10, FontStyle.Bold),
      visible: true,
      logScale: false,
      leftBottomSide: true,
      maximum: 0,
      minimum: 100
    });
    expect(axis).toBeInstanceOf(Axis);
  });
});
