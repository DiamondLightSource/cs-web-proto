/* Currently missing NumberFormat. */
export interface Range {
  min: number;
  max: number;
}

export const RANGE_NONE: Range = {
  min: 0,
  max: 0
};

export interface DisplayProvider {
  getAlarm(): Display;
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

export const display = (
  displayRange: Range,
  alarmRange: Range,
  warningRange: Range,
  controlRange: Range,
  unit: string
): Display =>
  new IDisplay(displayRange, alarmRange, warningRange, controlRange, unit);

export const DISPLAY_NONE = display(
  RANGE_NONE,
  RANGE_NONE,
  RANGE_NONE,
  RANGE_NONE,
  ""
);

export const isDisplayProvider = (object: any): object is DisplayProvider => {
  return "getDisplay" in object;
};

export const displayOf = (object: any): Display => {
  if (object && isDisplayProvider(object)) {
    return object.getAlarm();
  }
  return DISPLAY_NONE;
};
