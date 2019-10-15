import { DISPLAY_NONE, RANGE_NONE } from "./display";
import { ALARM_NONE, AlarmSeverity, AlarmStatus } from "./alarm";
import { timeNow } from "./time";
import { venum } from "./vtypes";

describe("Display", (): void => {
  test("DISPLAY_NONE has zero alarm range", (): void => {
    expect(DISPLAY_NONE.getAlarmRange()).toEqual(RANGE_NONE);
  });
  test("DISPLAY_NONE has zero warning range", (): void => {
    expect(DISPLAY_NONE.getWarningRange()).toEqual(RANGE_NONE);
  });
  test("DISPLAY_NONE has zero control range", (): void => {
    expect(DISPLAY_NONE.getControlRange()).toEqual(RANGE_NONE);
  });
  test("DISPLAY_NONE has zero display range", (): void => {
    expect(DISPLAY_NONE.getDisplayRange()).toEqual(RANGE_NONE);
  });
  test("DISPLAY_NONE has no units", (): void => {
    expect(DISPLAY_NONE.getUnit()).toEqual("");
  });
});

describe("Alarm", (): void => {
  test("ALARM_NONE has severity None", (): void => {
    expect(ALARM_NONE.getSeverity()).toEqual(AlarmSeverity.NONE);
  });
  test("ALARM_NONE has status None", (): void => {
    expect(ALARM_NONE.getStatus()).toEqual(AlarmStatus.NONE);
  });
  test("ALARM_NONE has no message", (): void => {
    expect(ALARM_NONE.getName()).toEqual("");
  });
});

describe("Time", (): void => {
  test("timeNow() is valid", (): void => {
    expect(timeNow().isValid()).toEqual(true);
  });
  test("timeNow() has user tag 0", (): void => {
    expect(timeNow().getUserTag()).toEqual(0);
  });
});

describe("VEnum", (): void => {
  test("venum function", (): void => {
    const ve = venum(0, ["zero", "one"]);
    expect(ve.getValue()).toEqual("zero");
    expect(ve.getIndex()).toEqual(0);
  });
});
