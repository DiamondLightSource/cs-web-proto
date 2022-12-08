import { Color } from "./color";
import { Font } from "./font";

// TO DO - find out which variables always appear and which don't and add ?

export class Axis {
  public autoScale?: boolean;
  public autoScaleThreshold?: number;
  public autoScaleTight?: boolean;
  public axisColor?: Color;
  public axisTitle?: string;
  public showGrid?: boolean;
  public gridColor?: Color;
  public dashGridLine?: boolean;
  public timeFormat?: string;
  public scaleFormat?: string;
  public scaleFont?: Font;
  public titleFont?: Font;
  public visible?: boolean;
  public logScale?: boolean;
  public leftBottomSide?: boolean;
  public maximum?: number;
  public minimum?: number;

  public constructor(
    autoScale: boolean,
    autoScaleThreshold: number,
    autoScaleTight: boolean,
    axisColor: Color,
    axisTitle: string,
    showGrid: boolean,
    gridColor: Color,
    dashGridLine: boolean,
    timeFormat: string,
    scaleFormat: string,
    scaleFont: Font,
    titleFont: Font,
    visible: boolean,
    logScale: boolean,
    leftBottomSide: boolean,
    maximum: number,
    minimum: number
  ) {
    this.autoScale = autoScale;
    this.autoScaleThreshold = autoScaleThreshold;
    this.autoScaleTight = autoScaleTight;
    this.axisColor = axisColor;
    this.axisTitle = axisTitle;
    this.showGrid = showGrid;
    this.gridColor = gridColor;
    this.dashGridLine = dashGridLine;
    this.timeFormat = timeFormat;
    this.scaleFormat = scaleFormat;
    this.scaleFont = scaleFont;
    this.titleFont = titleFont;
    this.visible = visible;
    this.logScale = logScale;
    this.leftBottomSide = leftBottomSide;
    this.maximum = maximum;
    this.minimum = minimum;
  }
}

export class Axes {
  public count: number;
  public axisOptions: Axis[];

  public constructor(count: number, axes: Axis[]) {
    this.count = count;
    this.axisOptions = axes;
  }
}
