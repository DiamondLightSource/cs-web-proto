import { Alarm } from "./alarm";
import { Display } from "./display";
import { Time } from "./time";

class VType {}

export abstract class VDouble extends VType {
  public abstract getValue(): number;
  public abstract getAlarm(): Alarm;
  public abstract getTime(): Time;
  public abstract getDisplay(): Display;
}

class IVDouble extends VDouble {
  private value: number;
  private alarm: Alarm;
  private time: Time;
  private display: Display;
  public constructor(
    value: number,
    alarm: Alarm,
    time: Time,
    display: Display
  ) {
    super();
    this.value = value;
    this.alarm = alarm;
    this.time = time;
    this.display = display;
  }
  public getValue(): number {
    return this.value;
  }
  public getAlarm(): Alarm {
    return this.alarm;
  }
  public getTime(): Time {
    return this.time;
  }
  public getDisplay(): Display {
    return this.display;
  }
}

export const doubleOf = (
  double: number,
  alarm: Alarm,
  time: Time,
  display: Display
): VDouble => new IVDouble(double, alarm, time, display);
