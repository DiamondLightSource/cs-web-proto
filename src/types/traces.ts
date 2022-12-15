import { Color } from "./color";

// TO DO - find out which variables always appear and which don't and add ?

export class Trace {
  public name?: string;
  public plotMode?: number; //convert to value instead of num?
  public lineWidth?: number;
  public traceType?: number; //convert?
  public traceColor?: Color;
  public updateDelay?: number;
  public updateMode?: number; //convert
  public pointStyle?: number; //convert
  public pointSize?: number;
  public concatenateData?: boolean;
  public bufferSize?: number;
  public visible?: boolean;
  public antiAlias?: boolean;
  public xPv?: string;
  public xPvValue?: number;
  public xAxisIndex?: number;
  public yPv?: string;
  public yPvValue?: number;
  public yAxisIndex?: number;

  public constructor(
    name: string,
    plotMode: number,
    lineWidth: number,
    traceType: number,
    traceColor: Color,
    updateDelay: number,
    updateMode: number,
    pointStyle: number,
    pointSize: number,
    concatenateData: boolean,
    bufferSize: number,
    visible: boolean,
    antiAlias: boolean,
    xPv: string,
    xPvValue: number,
    xAxisIndex: number,
    yPv: string,
    yPvValue: number,
    yAxisIndex: number
  ) {
    this.name = name;
    this.plotMode = plotMode;
    this.lineWidth = lineWidth;
    this.traceType = traceType;
    this.traceColor = traceColor;
    this.updateDelay = updateDelay;
    this.updateMode = updateMode;
    this.pointStyle = pointStyle;
    this.pointSize = pointSize;
    this.concatenateData = concatenateData;
    this.bufferSize = bufferSize;
    this.visible = visible;
    this.antiAlias = antiAlias;
    this.xPv = xPv;
    this.xPvValue = xPvValue;
    this.xAxisIndex = xAxisIndex;
    this.yPv = yPv;
    this.yPvValue = yPvValue;
    this.yAxisIndex = yAxisIndex;
  }
}

export class Traces {
  public count: number;
  public pvName: string;
  public traceOptions: Trace[];

  public constructor(count: number, pvName: string, traces: Trace[]) {
    this.count = count;
    this.pvName = pvName;
    this.traceOptions = traces;
  }
}
