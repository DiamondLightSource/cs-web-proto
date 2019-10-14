import { stringToVtype } from "./utils";

test("stringToVType returns string from string", (): void => {
  expect(stringToVtype("This is a string").getValue()).toBe("This is a string");
});

test("stringToVType returns number from number in string", (): void => {
  expect(stringToVtype("3.14159").getValue()).toBe(3.14159);
});
