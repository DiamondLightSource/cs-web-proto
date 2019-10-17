import { vstring } from "./string";
import { ALARM_NONE } from "./alarm";
import { Time } from "./time";

const STRING = "This is a string";

describe("VString", (): void => {
  test("vstring function", (): void => {
    const vs = vstring(STRING);
    expect(vs.getValue()).toEqual(STRING);
    expect(vs.toString()).toEqual(STRING);
    expect(vs.getAlarm()).toEqual(ALARM_NONE);
    expect(vs.getTime()).toBeInstanceOf(Time);
  });
});
