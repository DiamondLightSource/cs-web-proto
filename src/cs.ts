export type Scalar = number | string;

export interface Alarm {
  severity: number;
  status: number;
  message: string;
}

export interface Time {
  secondsPastEpoch: number;
  nanoseconds: number;
  userTag: number;
}

export interface Display {
  limitLow: number;
  limitHigh: number;
  description: string;
  format: string;
  units: string;
}

export interface Control {
  limitLow: number;
  limitHigh: number;
  minStep: number;
}

export interface NTScalar {
  type: string;
  value: Scalar;
  alarm?: Alarm;
  time?: Time;
  display?: Display;
  control?: Control;
}

export interface NTScalarArray {
  type: string;
  value: Scalar[];
  alarm?: Alarm;
  time?: Time;
  display?: Display;
  control?: Control;
}

export type NType = NTScalar | NTScalarArray;
