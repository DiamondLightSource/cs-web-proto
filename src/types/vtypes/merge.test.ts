import { mergeVtype } from "./merge";
import {
  vdouble,
  venum,
  VEnum,
  vdoubleArray,
  VDoubleArray,
  VDouble
} from "./vtypes";
import { timeNow } from "./time";

describe("mergeVtypes", (): void => {
  let result;
  let original;
  it("merges enums", (): void => {
    original = venum(0, ["one", "two", "three"]);
    result = mergeVtype(original, { type: "VEnum", index: 1 }) as VEnum;
    expect(result.getIndex()).toBe(1);
    expect(result.getDisplay().getChoices().length).toBe(3);
    expect(result.getValue()).toBe("two");

    result = mergeVtype(original, {
      type: "VEnum",
      choices: ["une", "deux", "trois"]
    }) as VEnum;
    expect(result.getIndex()).toBe(0);
    expect(result.getDisplay().getChoices().length).toBe(3);
    expect(result.getValue()).toBe("une");
  });

  it("raises errors if appropriate", (): void => {
    original = vdouble(0);
    result = mergeVtype(
      original,
      { type: "VEnum", choices: ["une", "deux", "trois"] },
      false
    ) as VEnum;
    expect(result.getValue()).toBe("error");

    original = vdouble(0);
    result = mergeVtype(original, { type: "VEnum", index: 0 }, false) as VEnum;
    expect(result.getValue()).toBe("error");
  });

  it("merges vdoubles", (): void => {
    original = vdouble(0);
    result = mergeVtype(
      original,
      { type: "VEnum", choices: ["une", "deux", "trois"], index: 1 },
      false
    ) as VEnum;
    expect(result.getValue()).toBe("deux");
    expect(result.getIndex()).toBe(1);
    expect(result.getDisplay().getChoices().length).toBe(3);

    original = vdouble(0);
    result = mergeVtype(original, { type: "IVDouble", value: 10 }) as VDouble;
    expect(result.getValue()).toBe(10);

    original = vdoubleArray([1, 2, 3], [3]);
    result = mergeVtype(original, {
      array: true,
      type: "IVDouble",
      value: [1, 2]
    }) as VDoubleArray;
    expect(result.getValue()[1]).toBe(2);
    expect(result.getValue().length).toBe(2);
  });

  it("handles null value in update", (): void => {
    const original = vdouble(0);
    const update = {
      time: timeNow(),
      value: null
    };

    const result = mergeVtype(original, update);
    expect(result).not.toBeUndefined();
    expect((result as VDouble).getValue()).toEqual(0);
  });
});