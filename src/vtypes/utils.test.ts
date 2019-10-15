import {
  stringToVtype,
  vtypeToString,
  valueToVtype,
  vtypeToNumber
} from "./utils";
import { vdouble } from "./vtypes";
import { vstring } from "./string";

const VDOUBLE = vdouble(1.2345);
const VSTR_NUM = vstring("1.2345");
const STRING = "This is a string";

describe("vtypeToString", (): void => {
  it("uses precision if specified", (): void => {
    expect(vtypeToString(VDOUBLE, 2)).toEqual("1.23");
  });
  it("gives full precision if precision omitted", (): void => {
    expect(vtypeToString(VDOUBLE)).toEqual("1.2345");
  });
});

describe("stringToVtype", (): void => {
  it("returns string from string", (): void => {
    expect(stringToVtype(STRING).getValue()).toBe(STRING);
  });
  it("returns number from number in string", (): void => {
    expect(stringToVtype("3.14159").getValue()).toBe(3.14159);
  });
});

describe("vtypeToNumber", (): void => {
  it("returns number from vtype", (): void => {
    expect(vtypeToNumber(VDOUBLE)).toBe(1.2345);
  });
  it("parses number from string", (): void => {
    expect(vtypeToNumber(VSTR_NUM)).toBe(1.2345);
  });
});

describe("valueToVType", (): void => {
  it("returns vstring from string", (): void => {
    const vstr = valueToVtype(STRING);
    expect(vstr.getValue()).toEqual(STRING);
  });
  it("returns number from number", (): void => {
    const vstr = valueToVtype(51);
    expect(vstr.getValue()).toEqual(51);
  });
});
