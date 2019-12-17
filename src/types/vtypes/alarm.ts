export enum AlarmSeverity {
  NONE,
  MINOR,
  MAJOR,
  INVALID,
  UNDEFINED
}

export enum AlarmStatus {
  NONE,
  DEVICE,
  DRIVER,
  RECORD,
  DB,
  CONF,
  UNDEFINED,
  CLIENT
}

export interface AlarmProvider {
  getAlarm(): Alarm;
}

export abstract class Alarm {
  public abstract getSeverity(): AlarmSeverity;
  public abstract getStatus(): AlarmStatus;
  public abstract getName(): string;
}

export class IAlarm extends Alarm {
  private severity: AlarmSeverity;
  private status: AlarmStatus;
  private name: string;
  public constructor(
    severity: AlarmSeverity,
    status: AlarmStatus,
    name: string
  ) {
    super();
    this.severity = severity;
    this.status = status;
    this.name = name;
  }
  public getSeverity(): AlarmSeverity {
    return this.severity;
  }
  public getStatus(): AlarmStatus {
    return this.status;
  }
  public getName(): string {
    return this.name;
  }
}

export const alarm = (
  severity: AlarmSeverity,
  status: AlarmStatus,
  name: string
): Alarm => {
  return new IAlarm(severity, status, name);
};

export const isAlarmProvider = (object: any): object is AlarmProvider => {
  return "getAlarm" in object;
};

export const ALARM_NONE = alarm(AlarmSeverity.NONE, AlarmStatus.NONE, "");

export const alarmOf = (object: any): Alarm => {
  if (object && isAlarmProvider(object)) {
    return object.getAlarm();
  }
  return ALARM_NONE;
};
