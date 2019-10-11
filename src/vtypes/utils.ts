import { VNumber, VType, VString, vdoubleOf, vstringOf, VEnum } from "./vtypes";
import { ALARM_NONE } from "./alarm";
import { timeNow } from "./time";
import { DISPLAY_NONE } from "./display";

export const vtypeToString = (vtype?: VType, precision?: number): string => {
  if (vtype instanceof VNumber) {
    if (precision) {
      return vtype.getValue().toFixed(precision);
    } else {
      return vtype.getValue().toString();
    }
  }
  if (vtype instanceof VString || vtype instanceof VEnum) {
    return vtype.getValue();
  }
  return "";
};

export function vtypeToNumber(vtype: VType): number {
  let value = vtype.getValue();
  let numericValue;
  if (typeof value === "number") {
    numericValue = value;
  } else if (typeof value === "string") {
    numericValue = parseFloat(value);
  } else {
    numericValue = 0;
  }
  return numericValue;
}

export function vtypeOrUndefinedToNumber(vtype?: VType): number {
  if (vtype) {
    return vtypeToNumber(vtype);
  } else {
    return 0;
  }
}

export const stringToVtype = (
  value: string,
  alarm = ALARM_NONE,
  time = timeNow(),
  display = DISPLAY_NONE
): VType => {
  try {
    let numberValue = parseFloat(value);
    return vdoubleOf(numberValue, alarm, time, display);
  } catch (error) {
    return vstringOf(value, alarm, time);
  }
};
