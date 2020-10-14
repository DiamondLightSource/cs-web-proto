import React from "react";
import { LedComponent } from "./led";
import { DAlarm, DType, AlarmQuality } from "../../../types/dtypes";
import renderer, { ReactTestRendererJSON } from "react-test-renderer";

const createValue = (alarmType: AlarmQuality): DType => {
  return new DType({ stringValue: "3.141" }, new DAlarm(alarmType, ""));
};

const unusedValue = createValue(AlarmQuality.ALARM);

const renderLed = (ledProps: any): ReactTestRendererJSON => {
  return renderer
    .create(<LedComponent {...ledProps} readonly={true} />)
    .toJSON() as ReactTestRendererJSON;
};

describe("led changes Css properties based on alarm", (): void => {
  test.each([
    [AlarmQuality.ALARM, "alarm"],
    [AlarmQuality.CHANGING, "changing"],
    [AlarmQuality.INVALID, "invalid"],
    [AlarmQuality.UNDEFINED, "undefined"],
    [AlarmQuality.VALID, "valid"],
    [AlarmQuality.WARNING, "warning"]
  ])("alarms map to className", (alarm, extraClass) => {
    const value = createValue(alarm as AlarmQuality);

    const ledProps = {
      value,
      alarmSensitive: true
    };

    const renderedLed = renderLed(ledProps);

    expect(renderedLed.props.className).toBe(`Led ${extraClass}`);
  });
});

describe("background color changes depending on color returned from rule", (): void => {
  test("background color from user is applied 1", (): void => {
    const ledProps = {
      value: unusedValue,
      userColor: "red",
      rules: ["stuff"]
    };

    const renderedLed = renderLed(ledProps);

    expect(renderedLed.props.style.backgroundColor).toBe(
      "rgba(255, 0, 0, 255)"
    );
  });

  test("background color from user is applied 2", (): void => {
    const ledProps = {
      value: unusedValue,
      userColor: "blue",
      rules: ["stuff"]
    };

    const renderedLed = renderLed(ledProps);

    expect(renderedLed.props.style.backgroundColor).toBe(
      "rgba(0, 0, 255, 255)"
    );
  });
});

describe("scale property is used", (): void => {
  test("scale is added to properties", (): void => {
    const renderedLed = renderLed({ scale: 2.0 });

    expect(renderedLed.props.style.transform).toBe("scale(2)");
  });
});
