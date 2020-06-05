import { DType } from "./dtypes";

export function mergeDtype(original: DType | undefined, update: DType): DType {
  return new DType(
    update.stringValue ?? original?.stringValue,
    update.doubleValue ?? original?.doubleValue,
    update.arrayValue ?? original?.arrayValue,
    update.alarm ?? original?.alarm,
    update.time ?? original?.time,
    update.display ?? original?.display
  );
}
