/* eslint no-template-curly-in-string: 0 */
import { MacroMap, resolveMacros, macrosEqual } from "./macros";

const macroMap: MacroMap = {
  A: "B",
  C: "D",
  E: "",
};

it("substitutes if macro matches", (): void => {
  const substituted = resolveMacros("X${A}", macroMap);
  expect(substituted).toEqual("XB");
});

it("handles empty macros", (): void => {
  const substituted = resolveMacros("X${E}", macroMap);
  expect(substituted).toEqual("X");
});

it("doesn't substitute if no macro matches", (): void => {
  const substituted = resolveMacros("X${F}", macroMap);
  expect(substituted).toEqual("X${F}");
});

it("varying brackets are still substituted", (): void => {
  const substituted = resolveMacros("X${A)", macroMap);
  expect(substituted).toEqual("XB");
});

it("line break characters are ignored", (): void => {
  const substituted = resolveMacros("X${\n}", macroMap);
  expect(substituted).toEqual("X${\n}");
});

it("multiple substitutions are made", (): void => {
  const substituted = resolveMacros("${A}${C}${E}A${F}${C)", macroMap);
  expect(substituted).toEqual("BDA${F}D");
});

it("true if macros match", (): void => {
  expect(macrosEqual(macroMap, macroMap)).toEqual(true);
});

it("false if macros with same properties don't have the same keys", (): void => {
  const macroB = { ...macroMap, A: "P" };

  expect(macrosEqual(macroMap, macroB)).toEqual(false);
});

it("false with macros with different properties", (): void => {
  const macroC: MacroMap = {
    G: "H",
    A: "B",
  };
  const macroD: MacroMap = {
    D: "P",
    Q: "X",
  };
  expect(macrosEqual(macroC, macroD)).toEqual(false);
});
