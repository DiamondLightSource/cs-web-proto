import { DType } from "./dtypes";

export function mergeDtype(original: DType | undefined, update: DType): DType {
  return new DType(
    {
      stringValue: update.value.stringValue ?? original?.value.stringValue,
      doubleValue: update.value.doubleValue ?? original?.value.doubleValue,
      arrayValue: update.value.arrayValue ?? original?.value.arrayValue
    },

    update.alarm ?? original?.alarm,
    update.time ?? original?.time,
    update.display ?? original?.display
  );
}
