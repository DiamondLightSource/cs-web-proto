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

export enum ChannelRole {
  RO,
  WO,
  RW
}

export enum DisplayForm {
  DEFAULT,
  STRING,
  BINARY,
  DECIMAL,
  HEX,
  EXPONENTIAL,
  ENGINEERING
}

export class DRange {
  public min: number;
  public max: number;
  public constructor(min: number, max: number) {
    this.min = min;
    this.max = max;
  }
  public static NONE = new DRange(0, 0);
}

export class DDisplay {
  public description?: string;
  public role?: ChannelRole;
  public controlRange?: DRange;
  public alarmRange?: DRange;
  public warningRange?: DRange;
  public units?: string;
  public precision?: number;
  public form?: DisplayForm;
  public choices?: string[];

  public constructor(
    description?: string,
    role?: ChannelRole,
    controlRange?: DRange,
    alarmRange?: DRange,
    warningRange?: DRange,
    units?: string,
    precision?: number,
    form?: DisplayForm,
    choices?: string[]
  ) {
    this.description = description;
    this.role = role;
    this.controlRange = controlRange;
    this.alarmRange = alarmRange;
    this.warningRange = warningRange;
    this.units = units;
    this.precision = precision;
    this.form = form;
    this.choices = choices;
  }

  public static NONE = new DDisplay(
    "",
    "",
    ChannelRole.RW,
    DRange.NONE,
    DRange.NONE,
    DRange.NONE,
    "",
    0,
    DisplayForm.DEFAULT,
    []
  );
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
  public display?: DDisplay;

  public constructor(
    value: DTypeValue,
    alarm?: DAlarm,
    time?: DTime,
    display?: DDisplay
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
    } else if (this.value.stringValue) {
      try {
        return parseFloat(this.value.stringValue);
      } catch (error) {
        return NaN;
      }
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
  public getDisplay(): DDisplay | undefined {
    return this.display;
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
  display = DDisplay.NONE
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

export function mergeDDisplay(
  original: DDisplay | undefined,
  update: DDisplay | undefined
): DDisplay {
  return new DDisplay(
    update?.label ?? original?.label,
    update?.description ?? original?.description,
    update?.role ?? original?.role,
    update?.controlRange ?? original?.controlRange,
    update?.alarmRange ?? original?.alarmRange,
    update?.warningRange ?? original?.warningRange,
    update?.units ?? original?.units,
    update?.precision ?? original?.precision,
    update?.form ?? original?.form,
    update?.choices ?? original?.choices
  );
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
    mergeDDisplay(original?.display, update.display)
  );
}
