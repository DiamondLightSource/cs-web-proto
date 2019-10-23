import log from "loglevel";

import {
  VType,
  vdouble,
  vdoubleArray,
  VNumberBuilder,
  VNumberArrayBuilder,
  enumOf,
  venum
} from "../vtypes/vtypes";

import {
  Alarm,
  alarmOf,
  AlarmSeverity,
  AlarmStatus,
  alarm
} from "../vtypes/alarm";

import { vstring } from "../vtypes/string";
import { Time, timeOf } from "../vtypes/time";
import { Display, displayOf } from "../vtypes/display";

const VNumbers: { [index: string]: VNumberBuilder } = {
  IVDouble: vdouble,
  VDouble: vdouble
};

const VNumberArrays: { [index: string]: VNumberArrayBuilder } = {
  IVDoubleArray: vdoubleArray,
  VDoubleArray: vdoubleArray
};

export interface PartialVType {
  type?: string;
  value?: any;
  array?: boolean;
  base64?: string;
  alarm?: Alarm;
  time?: Time;
  display?: Display;
  index?: number; // venum
  choices?: string[];
}

export function vtypeInfo(
  original: VType | undefined,
  update: PartialVType
): PartialVType | undefined {
  let className = update.type
    ? update.type
    : original
    ? original.constructor.name
    : undefined;
  const array =
    update.array !== undefined
      ? update.array
      : className !== undefined
      ? className.includes("Array")
      : undefined;
  const value =
    update.value !== undefined
      ? update.value
      : original
      ? original.getValue()
      : undefined;
  const alarmVal = update.alarm ? update.alarm : alarmOf(original);
  // should we require that the update has a time?
  const time = update.time ? update.time : timeOf(original);
  const display = update.display ? update.display : displayOf(original);

  const originalEnum = enumOf(original);
  const index =
    update.index !== undefined
      ? update.index
      : originalEnum
      ? originalEnum.getIndex()
      : undefined;
  const choices = update.choices
    ? update.choices
    : originalEnum
    ? originalEnum.getDisplay().getChoices()
    : undefined;
  return {
    type: className,
    array: array,
    value: value,
    alarm: alarmVal,
    time: time,
    display: display,
    index: index,
    choices: choices
  };
}

export function mergeVtype(
  original: VType,
  update: PartialVType,
  showErrors: boolean = true
): VType | undefined {
  try {
    if (update === undefined) {
      return undefined;
    }
    let info = vtypeInfo(original, update) || {};
    if (info.type === "VString" || info.type === "IVString") {
      // what happened to VStringArray in VTypes?
      return vstring(info.value, info.alarm, info.time);
    } else if (info.type === "VEnum" || info.type === "IVEnum") {
      if (info.index === undefined) {
        throw new Error("index unknown");
      }

      if (info.choices === undefined) {
        throw new Error("Choices unknown");
      }
      return venum(info.index, info.choices, info.alarm, info.time);
    } else {
      if (info.array) {
        let className = info.type;
        if (className === undefined) {
          throw new Error("Unreachable");
        } else {
          if (!className.endsWith("Array")) {
            className = `${className}Array`;
          }
          return VNumberArrays[className](
            info.value,
            info.value.length,
            info.alarm,
            info.time,
            info.display
          );
        }
      } else {
        if (info.type === undefined) {
          return undefined;
        } else {
          return VNumbers[info.type](
            info.value,
            info.alarm,
            info.time,
            info.display
          );
        }
      }
    }
  } catch (error) {
    // This happens occasionally, and has serious consequences, but I
    // don't know why!
    if (showErrors) {
      log.error("failed to merge vtypes", original, update, error);
    }
    return vstring(
      "error",

      alarm(AlarmSeverity.MAJOR, AlarmStatus.NONE, "error")
    );
  }
}
