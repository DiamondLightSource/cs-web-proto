import { Alarm, ALARM_NONE } from "./alarm";
import { Time, timeNow } from "./time";
import { Scalar } from "./vtypes";

export abstract class VString extends Scalar {
  public abstract getValue(): string;
}

class IVString extends VString {
  private value: string;
  private alarm: Alarm;
  private time: Time;

  public constructor(value: string, alarm: Alarm, time: Time) {
    super();
    this.value = value;
    this.alarm = alarm;
    this.time = time;
  }
  public getValue(): string {
    return this.value;
  }
  public getAlarm(): Alarm {
    return this.alarm;
  }
  public getTime(): Time {
    return this.time;
  }
  public toString(): string {
    return this.value;
  }
}

export const vstringOf = (
  value: string,
  alarm = ALARM_NONE,
  time = timeNow()
): VString => new IVString(value, alarm, time);
