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

/*
We could handle enums in a different way, by defining

type Scalar: number | string | Enum;

Then enums would be available in NTScalar and NTScalarArray. This would be
less similar to normative types.
*/
export interface Enum {
  index: number;
  choices: string[];
}

export interface NTEnum {
  type: string;
  value: Enum;
  descriptor?: string;
  alarm?: Alarm;
  time?: Time;
}

// export type NType = NTScalar | NTScalarArray | NTEnum;
export type NType = NTScalar;
