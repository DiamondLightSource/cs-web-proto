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

export enum AlarmQuality {
  VALID,
  WARNING,
  ALARM,
  INVALID,
  UNDEFINED,
  CHANGING
}

export class DAlarm {
  public quality: AlarmQuality;
  public message: string;

  public constructor(quality: AlarmQuality, message: string) {
    this.message = message;
    this.quality = quality;
  }

  public static NONE = new DAlarm(AlarmQuality.VALID, "");
  public static MINOR = new DAlarm(AlarmQuality.WARNING, "");
  public static MAJOR = new DAlarm(AlarmQuality.ALARM, "");
}

type NumberArray =
  | Int8Array
  | Uint8Array
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | BigInt64Array
  | BigUint64Array
  | Float32Array
  | Float64Array;

interface DTypeValue {
  stringValue?: string;
  doubleValue?: number;
  arrayValue?: NumberArray;
  stringArray?: string[];
}

export class DType {
  public value: DTypeValue;
  public time: DTime;
  public alarm?: DAlarm;
  public display?: Display;

  public constructor(
    value: DTypeValue,
    alarm?: DAlarm,
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

  public getArrayValue(): NumberArray {
    if (this.value.arrayValue) {
      return this.value.arrayValue;
    } else {
      return Float64Array.from([]);
    }
  }

  public getAlarm(): DAlarm {
    return this.alarm ?? DAlarm.NONE;
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
  alarm = DAlarm.NONE,
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

export function mergeDtype(original: DType | undefined, update: DType): DType {
  return new DType(
    {
      stringValue: update.value.stringValue ?? original?.value.stringValue,
      doubleValue: update.value.doubleValue ?? original?.value.doubleValue,
      arrayValue: update.value.arrayValue ?? original?.value.arrayValue
    },

    update.alarm ?? original?.alarm,
    update.time ?? original?.time,
    update.display ?? original?.display
  );
}
