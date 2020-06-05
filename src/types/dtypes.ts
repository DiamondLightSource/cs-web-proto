import { Alarm, ALARM_NONE } from "./vtypes/alarm";
import { Time, timeNow } from "./vtypes/time";
import { Display, DISPLAY_NONE } from "./vtypes/display";

export class DType {
  public stringValue?: string;
  public doubleValue?: number;
  public arrayValue?: number[];
  public alarm?: Alarm;
  public time?: Time;
  public display?: Display;

  public constructor(
    stringValue?: string,
    doubleValue?: number,
    arrayValue?: number[],
    alarm?: Alarm,
    time?: Time,
    display?: Display
  ) {
    // TODO check for no value.
    this.stringValue = stringValue;
    this.doubleValue = doubleValue;
    this.arrayValue = arrayValue;
    this.alarm = alarm;
    this.time = time;
    this.display = display;
  }

  public getStringValue(): string {
    if (this.stringValue) {
      return this.stringValue;
    } else if (this.doubleValue) {
      return this.doubleValue?.toString();
    } else if (this.arrayValue) {
      return this.arrayValue?.toString();
    } else {
      return "";
    }
  }

  public getDoubleValue(): number {
    // TODO what if not defined?
    if (this.doubleValue) {
      return this.doubleValue;
    } else {
      return NaN;
    }
  }

  public getAlarm(): Alarm {
    return this.alarm ?? ALARM_NONE;
  }
  public getTime(): Time {
    // TODO this isn't right
    return this.time ?? timeNow();
  }
  public getDisplay(): Display | undefined {
    return this.display ?? DISPLAY_NONE;
  }
}

export const dtypeToString = (dtype?: DType): string => {
  if (dtype) {
    return dtype.getStringValue();
  } else {
    return "";
  }
};
