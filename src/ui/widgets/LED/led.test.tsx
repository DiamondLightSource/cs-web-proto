import React from "react";
import { LedComponent } from "./led";
import { DAlarm, DType, AlarmQuality } from "../../../types/dtypes";
import renderer, { ReactTestRendererJSON } from "react-test-renderer";

const createValue = (alarmType: number): DType => {
  return new DType({ stringValue: "3.141" }, new DAlarm(alarmType, ""));
};

describe("led changes Css properties based on alarm and connection state", (): void => {
  test("className applied to led correctly", (): void => {
    const value = createValue(AlarmQuality.WARNING);

    const renderedLed = renderer
      .create(<LedComponent value={value} connected={true} readonly={true} />)
      .toJSON();

    // type errors of renderedLed may be null and ReactTestRendererJSON[] does
    // not have property type props, unless (renderedLed as ReactTestRenderedJSON)
    // is added
    expect((renderedLed as ReactTestRendererJSON).props.className).toBe(
      "Default Minor"
    );
  });
});
