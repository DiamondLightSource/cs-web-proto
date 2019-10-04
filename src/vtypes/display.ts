/* Currently missing NumberFormat. */
export interface Range {
  min: number;
  max: number;
}

export abstract class Display {
  public abstract getDisplayRange(): Range;
  public abstract getWarningRange(): Range;
  public abstract getAlarmRange(): Range;
  public abstract getControlRange(): Range;
  public abstract getUnit(): string;
}

class IDisplay {
  private displayRange: Range;
  private alarmRange: Range;
  private warningRange: Range;
  private controlRange: Range;
  private unit: string;

  public constructor(
    displayRange: Range,
    alarmRange: Range,
    warningRange: Range,
    controlRange: Range,
    unit: string
  ) {
    this.displayRange = displayRange;
    this.alarmRange = alarmRange;
    this.warningRange = warningRange;
    this.controlRange = controlRange;
    this.unit = unit;
  }
  public getDisplayRange(): Range {
    return this.displayRange;
  }
  public getAlarmRange(): Range {
    return this.alarmRange;
  }
  public getWarningRange(): Range {
    return this.warningRange;
  }
  public getControlRange(): Range {
    return this.controlRange;
  }
  public getUnit(): string {
    return this.unit;
  }
}

export const displayOf = (
  displayRange: Range,
  alarmRange: Range,
  warningRange: Range,
  controlRange: Range,
  unit: string
): Display =>
  new IDisplay(displayRange, alarmRange, warningRange, controlRange, unit);
