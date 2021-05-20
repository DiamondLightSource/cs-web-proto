import React from "react";
import { ReadbackComponent } from "./readback";
import { DType, DDisplay, DAlarm, AlarmQuality } from "../../../types/dtypes";
import { render } from "@testing-library/react";

describe("readback component", (): void => {
  test("numeric precision", (): void => {
    const readback = (
      <ReadbackComponent
        connected={true}
        readonly={false}
        value={
          new DType({ stringValue: "3.14159265359", doubleValue: 3.1415926539 })
        }
        precision={2}
      />
    );

    const { queryByText } = render(readback);
    // Check for precision.
    expect(queryByText("3.14")).toBeInTheDocument();
  });
  test("string value with units", (): void => {
    const readback = (
      <ReadbackComponent
        connected={true}
        readonly={false}
        value={
          new DType(
            { stringValue: "hello" },
            undefined,
            undefined,
            new DDisplay({ units: "xyz" })
          )
        }
        precision={2}
        showUnits={true}
      />
    );

    const { queryByText } = render(readback);
    // Units displayed along with the value.
    expect(queryByText("hello xyz")).toBeInTheDocument();
  });
  test("alarm-sensitive foreground colour", (): void => {
    const readback = (
      <ReadbackComponent
        connected={true}
        readonly={false}
        alarmSensitive={true}
        value={
          new DType(
            { stringValue: "hello" },
            new DAlarm(AlarmQuality.ALARM, "")
          )
        }
        precision={2}
      />
    );

    const { queryByText } = render(readback);
    // 'alarm' class added.
    expect(queryByText("hello")).toHaveStyle("color: var(--alarm)");
  });
});
