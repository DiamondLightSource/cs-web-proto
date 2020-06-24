import { dstring, ddoubleArray, ddouble } from "../setupTests";
import { valueToDType, mergeDType } from "./dtypes";

const stringDType = dstring("hello");

describe("DType", (): void => {
  test("getStringValue", (): void => {
    expect(stringDType.getStringValue()).toEqual("hello");
  });

  test("getDoubleValue returns nan if empty", (): void => {
    expect(stringDType.getDoubleValue()).toBeNaN();
  });

  test("getDoubleValue returns nan if array type", (): void => {
    const arrayDType = ddoubleArray([1, 2, 3]);
    expect(arrayDType.getDoubleValue()).toBeNaN();
  });

  test("getArrayValue if empty", (): void => {
    expect(stringDType.getArrayValue()).toEqual(Float64Array.from([]));
  });

  test("valueToDType handles string", (): void => {
    expect(valueToDType("hello").getStringValue()).toEqual("hello");
  });

  test("valueToDType handles double", (): void => {
    expect(valueToDType(4).getDoubleValue()).toEqual(4);
  });
});

describe("mergeDType", (): void => {
  test("returns update if not partial", (): void => {
    const doubleDType = ddouble(3);
    expect(mergeDType(doubleDType, stringDType)).toEqual(stringDType);
  });
});
