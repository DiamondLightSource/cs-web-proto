import React from "react";
import { LedComponent, LedComponentProps } from "./led";
import { DAlarm, DType, AlarmQuality } from "../../../types/dtypes";
import renderer, { ReactTestRendererJSON } from "react-test-renderer";
import { Color } from "../../../types/color";
import { ddouble } from "../../../testResources";

const createValue = (alarmType: AlarmQuality): DType => {
  return new DType({ stringValue: "3.141" }, new DAlarm(alarmType, ""));
};

const UNUSED_VALUE = createValue(AlarmQuality.ALARM);

const DEFAULT_PROPS = {
  value: UNUSED_VALUE,
  connected: true,
  readonly: false,
  offColor: Color.RED,
  onColor: Color.GREEN
};

const renderLed = (ledProps: LedComponentProps): ReactTestRendererJSON => {
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
      ...DEFAULT_PROPS,
      value,
      alarmSensitive: true
    };

    const renderedLed = renderLed(ledProps);

    expect(renderedLed.props.className).toBe(`Led ${extraClass}`);
  });
});

describe("background color changes depending on value", (): void => {
  test("off color is applied if value zero", (): void => {
    const ledProps = {
      ...DEFAULT_PROPS,
      value: ddouble(0)
    };

    const renderedLed = renderLed(ledProps);

    expect(renderedLed.props.style.backgroundColor).toBe(Color.RED.toString());
  });

  test("on color is applied if value not zero", (): void => {
    const ledProps = {
      ...DEFAULT_PROPS,
      value: ddouble(1)
    };

    const renderedLed = renderLed(ledProps);

    expect(renderedLed.props.style.backgroundColor).toBe(
      Color.GREEN.toString()
    );
  });
});

describe("width property is used", (): void => {
  test("width changes the size of the LED", (): void => {
    const renderedLed = renderLed({ ...DEFAULT_PROPS, width: 10 });

    // Width in CS-Studio doesn't quite match width in the browser,
    // so whatever is input has 5 subtracted from it, this makes it
    // look more like CS-Studio
    expect(renderedLed.props.style.width).toBe("5px");
    expect(renderedLed.props.style.height).toBe("5px");
  });
});
