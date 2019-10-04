interface Instant {
  secondsPastEpoch: number;
  nanoseconds: number;
}

export abstract class Time {
  public abstract getInstant(): Instant;
  public abstract getUserTag(): number;
  public abstract isValid(): boolean;
}

class ITime extends Time {
  private instant: Instant;
  private userTag: number;
  private valid: boolean;
  public constructor(instant: Instant, userTag: number, valid: boolean) {
    super();
    this.instant = instant;
    this.userTag = userTag;
    this.valid = valid;
  }
  public getInstant(): Instant {
    return this.instant;
  }
  public getUserTag(): number {
    return this.userTag;
  }
  public isValid(): boolean {
    return this.valid;
  }
}

export const timeOf = (
  instant: Instant,
  userTag: number,
  valid: boolean
): Time => new ITime(instant, userTag, valid);

export const instantNow = (): Instant => {
  const nowMillis = new Date().getTime();
  const secs = nowMillis / 1000;
  const nanos = (nowMillis % 1000) * 1e6;
  return {
    secondsPastEpoch: secs,
    nanoseconds: nanos
  };
};
export const timeNow = (): Time => {
  return timeOf(instantNow(), 0, true);
};
