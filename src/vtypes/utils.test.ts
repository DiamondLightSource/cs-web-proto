import { stringToVtype } from "./utils";

import { VType } from "./vtypes";

test("stringToVType returns string from string", () => {
  expect(stringToVtype("This is a string").getValue()).toBe("This is a string");
});

test("stringToVType returns number from number in string", () => {
  expect(stringToVtype("3.14159").getValue()).toBe(3.14159);
});
