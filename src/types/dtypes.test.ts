import { DType } from "./dtypes";

describe("DType", (): void => {
  test("getStringValue", (): void => {
    const stringDtype = new DType("hello");
    expect(stringDtype.getStringValue()).toEqual("hello");
  });
});
