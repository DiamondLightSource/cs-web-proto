import { Alarm, ALARM_NONE } from "./vtypes/alarm";
import { Time, timeNow } from "./vtypes/time";
import { Display, DISPLAY_NONE } from "./vtypes/display";

interface DTypeValue {
  stringValue?: string;
  doubleValue?: number;
  arrayValue?: number[];
}

export class DType {
  public value: DTypeValue;
  public time: Time;
  public alarm?: Alarm;
  public display?: Display;

  public constructor(
    value: DTypeValue,
    alarm?: Alarm,
    time?: Time,
    display?: Display
  ) {
    // TODO check for no value.
    this.value = value;
    this.alarm = alarm;
    this.time = time ?? timeNow();
    this.display = display;
  }

  public getStringValue(): string {
    if (this.value.stringValue) {
      return this.value.stringValue;
    } else if (this.value.doubleValue) {
      return this.value.doubleValue?.toString();
    } else if (this.value.arrayValue) {
      return this.value.arrayValue?.toString();
    } else {
      return "";
    }
  }

  public getDoubleValue(): number {
    // TODO what if not defined?
    if (this.value.doubleValue) {
      return this.value.doubleValue;
    } else {
      return NaN;
    }
  }

  public getAlarm(): Alarm {
    return this.alarm ?? ALARM_NONE;
  }
  public getTime(): Time {
    return this.time;
  }
  public getDisplay(): Display | undefined {
    return this.display ?? DISPLAY_NONE;
  }

  public toString(): string {
    return this.getStringValue();
  }
}

export const dtypeToString = (dtype?: DType): string => {
  if (dtype) {
    return dtype.getStringValue();
  } else {
    return "";
  }
};
