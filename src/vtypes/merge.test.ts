import { mergeVtype } from "./merge";
import { vdouble, venum, IVEnum, vdoubleArray } from "./vtypes";
import { timeNow } from "./time";

it("merges things", (): void => {
  let result;
  let original;
  original = venum(0, ["one", "two", "three"]);
  result = mergeVtype(original, { type: "VEnum", index: 1 }) as IVEnum;
  expect(result.getIndex()).toBe(1);
  expect(result.getDisplay().getChoices().length).toBe(3);
  expect(result.getValue()).toBe("two");

  result = mergeVtype(original, {
    type: "VEnum",
    choices: ["une", "deux", "trois"]
  }) as IVEnum;
  expect(result.getIndex()).toBe(0);
  expect(result.getDisplay().getChoices().length).toBe(3);
  expect(result.getValue()).toBe("une");

  original = vdouble(0);
  result = mergeVtype(
    original,
    { type: "VEnum", choices: ["une", "deux", "trois"] },
    false
  ) as IVEnum;
  expect(result.getValue()).toBe("error");

  original = vdouble(0);
  result = mergeVtype(original, { type: "VEnum", index: 0 }, false) as IVEnum;
  expect(result.getValue()).toBe("error");

  original = vdouble(0);
  result = mergeVtype(
    original,
    { type: "VEnum", choices: ["une", "deux", "trois"], index: 1 },
    false
  ) as IVEnum;
  expect(result.getValue()).toBe("deux");
  expect(result.getIndex()).toBe(1);
  expect(result.getDisplay().getChoices().length).toBe(3);

  original = vdouble(0);
  result = mergeVtype(original, { type: "IVDouble", value: 10 }) as IVDouble;
  expect(result.getValue()).toBe(10);

  original = vdoubleArray([1, 2, 3], [3]);
  result = mergeVtype(original, {
    array: true,
    type: "IVDouble",
    value: [1, 2]
  }) as IVDouble;
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
