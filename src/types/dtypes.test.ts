import { dstring, ddoubleArray, ddouble } from "../setupTests";
import { valueToDType, mergeDType, DType } from "./dtypes";

const stringDType = dstring("hello");
const doubleDType = ddouble(42);

describe("DType", (): void => {
  test("getStringValue", (): void => {
    expect(stringDType.getStringValue()).toEqual("hello");
  });

  test("getDoubleValue returns double value", (): void => {
    expect(doubleDType.getDoubleValue()).toEqual(42);
  });

  test("getDoubleValue returns undefined if empty", (): void => {
    expect(stringDType.getDoubleValue()).toBeUndefined();
  });

  test("getDoubleValue returns undefined if array type", (): void => {
    const arrayDType = ddoubleArray([1, 2, 3]);
    expect(arrayDType.getDoubleValue()).toBeUndefined();
  });

  test("getArrayValue returns udnefined if empty", (): void => {
    expect(stringDType.getArrayValue()).toBeUndefined();
  });

  test("valueToDType handles string", (): void => {
    expect(valueToDType("hello").getStringValue()).toEqual("hello");
  });

  test("valueToDType handles double", (): void => {
    expect(valueToDType(4).getDoubleValue()).toEqual(4);
  });
});

describe("DType coercion", (): void => {
  test("coerceDouble() returns double if defined", (): void => {
    expect(DType.coerceDouble(doubleDType)).toEqual(42);
  });

  test("coerceDouble() returns NaN if undefined", (): void => {
    expect(DType.coerceDouble(undefined)).toBeNaN();
  });

  test("coerceDouble() returns NaN if empty", (): void => {
    expect(DType.coerceDouble(stringDType)).toBeNaN();
  });

  test("coerceDouble() returns NaN if empty", (): void => {
    expect(DType.coerceDouble(stringDType)).toBeNaN();
  });
});

describe("mergeDType", (): void => {
  test("returns update if not partial", (): void => {
    const doubleDType = ddouble(3);
    expect(mergeDType(doubleDType, stringDType)).toEqual(stringDType);
  });
});
