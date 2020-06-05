import { Alarm, ALARM_NONE } from "./alarm";
import { Display, DISPLAY_NONE } from "./display";

export class DTime {
  public datetime: Date;

  public constructor(datetime: Date) {
    this.datetime = datetime;
  }
}

export function dtimeNow(): DTime {
  return new DTime(new Date());
}

interface DTypeValue {
  stringValue?: string;
  doubleValue?: number;
  arrayValue?: number[];
}

export class DType {
  public value: DTypeValue;
  public time: DTime;
  public alarm?: Alarm;
  public display?: Display;

  public constructor(
    value: DTypeValue,
    alarm?: Alarm,
    time?: DTime,
    display?: Display
  ) {
    // TODO check for no value.
    this.value = value;
    this.alarm = alarm;
    this.time = time ?? dtimeNow();
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
  public getTime(): DTime {
    return this.time;
  }
  public getDisplay(): Display | undefined {
    return this.display ?? DISPLAY_NONE;
  }

  public toString(): string {
    return this.getStringValue();
  }
}

export function dtypeToString(dtype?: DType): string {
  if (dtype) {
    return dtype.getStringValue();
  } else {
    return "";
  }
}

export function valueToDtype(
  value: any,
  alarm = ALARM_NONE,
  time = dtimeNow(),
  display = DISPLAY_NONE
): DType {
  const dvalue: DTypeValue = {};
  if (typeof value === "string") {
    dvalue.stringValue = value;
  } else if (typeof value === "number") {
    dvalue.doubleValue = value;
  } else {
    dvalue.doubleValue = 0;
  }
  return new DType(dvalue, alarm, time, display);
}
