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

export abstract class Alarm {
  public abstract getSeverity(): AlarmSeverity;
  public abstract getStatus(): AlarmStatus;
  public abstract getName(): string;
}

class IAlarm extends Alarm {
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

export const alarmOf = (
  severity: AlarmSeverity,
  status: AlarmStatus,
  name: string
): Alarm => {
  return new IAlarm(severity, status, name);
};

export const ALARM_NONE = alarmOf(AlarmSeverity.NONE, AlarmStatus.NONE, "");
