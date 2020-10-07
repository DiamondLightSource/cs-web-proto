import { getClass } from "./alarm";
import { DAlarm, AlarmQuality } from "../../types/dtypes";
import { NoSubstitutionTemplateLiteral } from "typescript";

const classes = {
  Default: "Default",
  Major: "Major",
  Minor: "Minor",
  Disconnected: "Disconnected"
};

const createAlarm = (alarmType: number): DAlarm => {
  return new DAlarm(alarmType, "");
};

type TestTuple = [number, boolean, string];

describe("getClass responds to different alarms and connection states", (): void => {
  test.each<TestTuple>([
    [AlarmQuality.UNDEFINED, true, "Default"],
    [AlarmQuality.ALARM, true, "Default Major"],
    [AlarmQuality.WARNING, true, "Default Minor"],
    [AlarmQuality.UNDEFINED, false, "Default Disconnected"],
    [AlarmQuality.ALARM, false, "Default Disconnected"],
    [AlarmQuality.WARNING, false, "Default Disconnected"]
  ])(
    "Alarms are assigned to corresponding classNames",
    (alarmType, connected, className) => {
      const alarm = createAlarm(alarmType);

      const cls = getClass(classes, connected, alarm.quality);
      expect(cls).toBe(className);
    }
  );

  test("passing in defaultClass can override default", (): void => {
    const alarm = createAlarm(AlarmQuality.ALARM);
    const cls = getClass(classes, true, alarm.quality, classes.Major);
    expect(cls).toBe("Major Major");
  });
});
