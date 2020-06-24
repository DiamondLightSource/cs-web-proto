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

  public constructor({
    description = undefined,
    role = undefined,
    controlRange = undefined,
    alarmRange = undefined,
    warningRange = undefined,
    units = undefined,
    precision = undefined,
    form = undefined,
    choices = undefined
  }: {
    description?: string;
    role?: ChannelRole;
    controlRange?: DRange;
    alarmRange?: DRange;
    warningRange?: DRange;
    units?: string;
    precision?: number;
    form?: DisplayForm;
    choices?: string[];
  } = {}) {
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

  public static NONE = new DDisplay({});
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
  public time?: DTime;
  public alarm?: DAlarm;
  public display: DDisplay;
  // If partial, this DType may be merged with an existing
  // value to create the latest status.
  public partial = false;

  public constructor(
    value: DTypeValue,
    alarm?: DAlarm,
    time?: DTime,
    display?: DDisplay,
    partial?: boolean
  ) {
    // TODO check for no value.
    this.value = value;
    this.alarm = alarm;
    this.time = time;
    this.display = display ?? DDisplay.NONE;
    if (partial) {
      this.partial = true;
    }
  }

  public getStringValue(): string | undefined {
    return this.value.stringValue;
  }

  public static coerceString(value?: DType): string {
    if (value) {
      const stringValue = value.getStringValue();
      const doubleValue = value.getDoubleValue();
      const arrayValue = value.getDoubleValue();
      if (stringValue !== undefined) {
        return stringValue;
      } else if (doubleValue !== undefined) {
        return doubleValue.toString();
      } else if (arrayValue !== undefined) {
        return arrayValue.toString();
      } else {
        return "";
      }
    } else {
      return "";
    }
  }

  public getDoubleValue(): number | undefined {
    return this.value.doubleValue;
  }

  public static coerceDouble(value?: DType): number {
    if (value !== undefined) {
      const doubleValue = value.getDoubleValue();
      const stringValue = value.getStringValue();
      if (typeof doubleValue === "number") {
        return doubleValue;
      } else if (stringValue !== undefined) {
        // Returns NaN if cannot parse.
        return parseFloat(stringValue);
      } else {
        return NaN;
      }
    } else {
      return NaN;
    }
  }

  public getArrayValue(): NumberArray | undefined {
    return this.value.arrayValue;
  }

  public static coerceArray(value: DType): NumberArray {
    const arrayValue = value.getArrayValue();
    const doubleValue = value.getDoubleValue();
    if (arrayValue !== undefined) {
      return arrayValue;
    } else if (doubleValue !== undefined) {
      return Float64Array.from([doubleValue]);
    } else {
      return Float64Array.from([]);
    }
  }

  public getStringArrayValue(): string[] | undefined {
    return this.value.stringArray;
  }

  public getAlarm(): DAlarm {
    return this.alarm ?? DAlarm.NONE;
  }
  public getTime(): DTime | undefined {
    return this.time;
  }
  public getDisplay(): DDisplay | undefined {
    return this.display;
  }

  public toString(): string {
    return DType.coerceString(this);
  }
}

export function valueToDType(
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
    // TODO this is not correct!
    dvalue.doubleValue = 0;
  }
  return new DType(dvalue, alarm, time, display);
}

export function mergeDDisplay(
  original: DDisplay | undefined,
  update: DDisplay | undefined
): DDisplay {
  return new DDisplay({
    description: update?.description ?? original?.description,
    role: update?.role ?? original?.role,
    controlRange: update?.controlRange ?? original?.controlRange,
    alarmRange: update?.alarmRange ?? original?.alarmRange,
    warningRange: update?.warningRange ?? original?.warningRange,
    units: update?.units ?? original?.units,
    precision: update?.precision ?? original?.precision,
    form: update?.form ?? original?.form,
    choices: update?.choices ?? original?.choices
  });
}

export function mergeDType(original: DType | undefined, update: DType): DType {
  if (!update.partial) {
    return update;
  } else {
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
}
