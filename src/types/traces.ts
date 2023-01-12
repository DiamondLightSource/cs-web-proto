import { Color } from "./color";

// Colour chart for traces

const TRACE_COLOR_ARRAY: { [key: number]: Color } = {
  0: new Color("rgb(21, 21, 196)"), // blue
  1: new Color("rgb(242, 26, 26)"), // red
  2: new Color("rgb(33, 179, 33)"), // green
  3: new Color("rgb(0, 0, 0)"), // black
  4: new Color("rgb(128, 0, 255)"), // violet
  5: new Color("rgb(255, 170, 0)"), // (darkish) yellow
  6: new Color("rgb(255, 0, 240)"), // pink
  7: new Color("rgb(243, 132, 132)"), // peachy
  8: new Color("rgb(0, 255, 11)"), // neon green
  9: new Color("rgb(0, 214, 255)"), // neon blue
  10: new Color("rgb(114, 40, 3)"), // brown
  11: new Color("rgb(219, 128, 4)"), // orange
  12: new Color("rgb(21, 21, 196)"), // Repeat colours until 20
  13: new Color("rgb(242, 26, 26)"),
  14: new Color("rgb(33, 179, 33)"),
  15: new Color("rgb(0, 0, 0)"),
  16: new Color("rgb(128, 0, 255)"),
  17: new Color("rgb(255, 170, 0)"),
  18: new Color("rgb(255, 0, 240)"),
  19: new Color("rgb(243, 132, 132)")
};

export class Trace {
  public index?: number;
  public name?: string;
  public plotMode?: number;
  public lineWidth?: number;
  public traceType?: number;
  public traceColor?: Color;
  public updateDelay?: number;
  public updateMode?: number;
  public pointStyle?: number;
  public pointSize?: number;
  public concatenateData?: boolean;
  public bufferSize?: number;
  public visible?: boolean = true;
  public xPv?: string | null;
  public xPvValue?: number | null;
  public xAxisIndex?: number;
  public yPv?: string | null;
  public yPvValue?: number | null;
  public yAxisIndex?: number;

  /**
   * Constructs the trace and sets default values for
   * properties, otherwise uses set property except for
   * xPv, yPv, xPvValue and yPvValue as their defaults
   * are undefined. Uses same default values as
   * csstudio.opibuilder.xygraph.
   */
  public constructor() {
    this.index = this.index ?? 0;
    this.name = this.name ?? "";
    this.plotMode = this.plotMode ?? 0;
    this.lineWidth = this.lineWidth ?? 1;
    this.traceType = this.traceType ?? 0;
    this.traceColor = this.traceColor ?? TRACE_COLOR_ARRAY[this.index];
    this.updateDelay = this.updateDelay ?? 100;
    this.updateMode = this.updateMode ?? 0;
    this.pointStyle = this.pointStyle ?? 0;
    this.pointSize = this.pointSize ?? 4;
    this.concatenateData = this.concatenateData ?? true;
    this.bufferSize = this.bufferSize ?? 100;
    this.visible = this.visible ?? true;
    this.xAxisIndex = this.xAxisIndex ?? 0;
    this.yAxisIndex = this.yAxisIndex ?? 1;
  }
}

export class Traces {
  public count: number;
  public pvName: string;
  public traceOptions: Trace[];

  public constructor(count: number, pvName: string, traces: Trace[]) {
    if (count !== traces.length) {
      throw new Error(
        `Count ${count} is not equal to number of traces ${traces.length}`
      );
    }
    this.count = count;
    this.pvName = pvName;
    this.traceOptions = traces;
  }
}
