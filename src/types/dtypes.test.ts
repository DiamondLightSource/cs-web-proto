import { dstring, ddoubleArray, ddouble } from "../testResources";
import {
  mergeDType,
  DType,
  DDisplay,
  DRange,
  mergeDDisplay,
  DAlarm
} from "./dtypes";

const stringDType = dstring("hello");
const doubleDType = ddouble(42);
const arrayDType = ddoubleArray([3, 5, 0.5]);

describe("DType", (): void => {
  test("getStringValue() returns string if present", (): void => {
    expect(stringDType.getStringValue()).toEqual("hello");
  });

  test("getDoubleValue() returns double value", (): void => {
    expect(doubleDType.getDoubleValue()).toEqual(42);
  });

  test("getDoubleValue() returns undefined if empty", (): void => {
    expect(stringDType.getDoubleValue()).toBeUndefined();
  });

  test("getDoubleValue() returns undefined if array type", (): void => {
    const arrayDType = ddoubleArray([1, 2, 3]);
    expect(arrayDType.getDoubleValue()).toBeUndefined();
  });

  test("getArrayValue() returns undefined if empty", (): void => {
    expect(stringDType.getArrayValue()).toBeUndefined();
  });
});

describe("DType coercion", (): void => {
  test("coerceDouble() returns double if defined", (): void => {
    expect(DType.coerceDouble(doubleDType)).toEqual(42);
  });
  test("coerceDouble() returns NaN if invalid string", (): void => {
    expect(DType.coerceDouble(dstring("2 or 3"))).toBeNaN();
  });

  test("coerceDouble() returns NaN if undefined", (): void => {
    expect(DType.coerceDouble(undefined)).toBeNaN();
  });

  test("coerceDouble() returns NaN if empty", (): void => {
    expect(DType.coerceDouble(stringDType)).toBeNaN();
  });

  test("coerceString() returns numeric string", (): void => {
    expect(DType.coerceString(doubleDType)).toEqual("42");
  });

  test("coerceString() returns string if defined", (): void => {
    expect(DType.coerceString(stringDType)).toEqual("hello");
  });

  test("coerceString() returns array type", (): void => {
    expect(DType.coerceString(arrayDType)).toEqual("3,5,0.5");
  });

  test("coerceArray() returns array if defined", (): void => {
    expect(DType.coerceArray(ddoubleArray([1, 2, 3]))).toEqual(
      Float64Array.from([1, 2, 3])
    );
  });
  test("coerceArray() returns array from double value", (): void => {
    expect(DType.coerceArray(doubleDType)).toEqual(Float64Array.from([42]));
  });
});

describe("mergeDType", (): void => {
  test("returns update if not partial", (): void => {
    const doubleDType = ddouble(3);
    expect(mergeDType(doubleDType, stringDType)).toEqual(stringDType);
  });

  test("returns merge if  update is partial", (): void => {
    const orig = new DType({ doubleValue: 3 });
    const alarmDType = new DType({}, DAlarm.MAJOR, undefined, undefined, true);
    const expected = new DType({ doubleValue: 3 }, DAlarm.MAJOR);
    expect(mergeDType(orig, alarmDType)).toEqual(expected);
  });

  test("mergeDDisplay merges values", (): void => {
    const orig = new DDisplay({ units: "A" });
    const update = new DDisplay({ warningRange: new DRange(1, 2) });
    const expected = new DDisplay({
      units: "A",
      warningRange: new DRange(1, 2)
    });
    expect(mergeDDisplay(orig, update)).toEqual(expected);
  });
});
