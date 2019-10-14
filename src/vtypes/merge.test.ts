import { mergeVtype } from './merge';
import { vdouble, venum, IVEnum, vdoubleArray } from './vtypes';

it("merges things", () => {
  let result;
  let original;
  original = venum(0, ["one", "two", "three"]);
  result = <IVEnum>mergeVtype(original, { "type": "VEnum", "index": 1 });
  expect(result.getIndex()).toBe(1);
  expect(result.getDisplay().getChoices().length).toBe(3);
  expect(result.getValue()).toBe("two");

  result = <IVEnum>mergeVtype(original, { "type": "VEnum", "choices": ["une", "deux", "trois"] });
  expect(result.getIndex()).toBe(0);
  expect(result.getDisplay().getChoices().length).toBe(3);
  expect(result.getValue()).toBe("une");

  original = vdouble(0);
  result = <IVEnum>mergeVtype(original, { "type": "VEnum", "choices": ["une", "deux", "trois"] }, false);
  expect(result.getValue()).toBe("error")

  original = vdouble(0);
  result = <IVEnum>mergeVtype(original, { "type": "VEnum", "index": 0 }, false);
  expect(result.getValue()).toBe("error")

  original = vdouble(0);
  result = <IVEnum>mergeVtype(original, { "type": "VEnum", "choices": ["une", "deux", "trois"], "index": 1 }, false);
  expect(result.getValue()).toBe("deux")
  expect(result.getIndex()).toBe(1);
  expect(result.getDisplay().getChoices().length).toBe(3);

  original = vdouble(0);
  result = <IVDouble>mergeVtype(original, { "type": "IVDouble", "value": 10 });
  expect(result.getValue()).toBe(10);

  original = vdoubleArray([1, 2, 3], [3]);
  result = <IVDouble>mergeVtype(original, { "array": true, "type": "IVDouble", "value": [1, 2] });
  expect(result.getValue()[1]).toBe(2);
  expect(result.getValue().length).toBe(2);
});
