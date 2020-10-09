import React from "react";
import { LedComponent } from "./led";
import { DAlarm, DType, AlarmQuality } from "../../../types/dtypes";
import renderer, { ReactTestRendererJSON } from "react-test-renderer";

const createValue = (alarmType: number): DType => {
  return new DType({ stringValue: "3.141" }, new DAlarm(alarmType, ""));
};

const unusedValue = createValue(AlarmQuality.ALARM);

const renderLed = (
  ledProps: any,
  connected: boolean
): ReactTestRendererJSON => {
  return renderer
    .create(
      <LedComponent {...ledProps} connected={connected} readonly={true} />
    )
    .toJSON() as ReactTestRendererJSON;
};

describe("led changes Css properties based on alarm and connection state", (): void => {
  test("className applied to led correctly", (): void => {
    const value = createValue(AlarmQuality.WARNING);

    const ledProps = {
      value
    };

    const renderedLed = renderLed(ledProps, true);

    // type errors of renderedLed may be null and ReactTestRendererJSON[] does
    // not have property type props, unless (renderedLed as ReactTestRenderedJSON)
    // is added
    expect(renderedLed.props.style.backgroundColor).toBe(
      "rgba(255, 255, 0, 255)"
    );
  });
});

describe("css properties change depending on user defined rule", (): void => {
  test("useRule overwrites the default alarm behaviour", (): void => {
    const ledProps = {
      value: unusedValue,
      userColor: "red"
    };

    const renderedLed = renderLed(ledProps, true);

    expect(renderedLed.props.style.backgroundColor).toBe(
      "rgba(255, 0, 0, 255)"
    );
  });

  test("rule resolved but component is disconnected should results in Default Disconnected", (): void => {
    const ledProps = {
      value: unusedValue
    };

    const renderedLed = renderLed(ledProps, false);

    expect(renderedLed.props.style.backgroundColor).toBe(
      "rgba(220, 220, 220, 255)"
    );
  });
});

describe("scale property is used", (): void => {
  test("scale is added to properties", (): void => {
    const renderedLed = renderLed({ scale: 2.0 }, true);

    expect(renderedLed.props.style.transform).toBe("scale(2)");
  });
});
