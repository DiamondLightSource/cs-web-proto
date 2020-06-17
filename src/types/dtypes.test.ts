import { DType } from "./dtypes";

describe("DType", (): void => {
  test("getStringValue", (): void => {
    const stringDtype = new DType({stringValue: "hello"});
    expect(stringDtype.getStringValue()).toEqual("hello");
  });
});
