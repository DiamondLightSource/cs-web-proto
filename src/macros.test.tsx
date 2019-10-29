/* eslint no-template-curly-in-string: 0 */
import { MacroMap } from "./redux/csState";
import { resolveMacros } from "./macros";

const macroMap: MacroMap = {
  A: "B",
  C: "D",
  E: ""
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
