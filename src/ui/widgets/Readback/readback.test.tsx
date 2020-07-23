import React from "react";
import { ReadbackComponent } from "./readback";
import { DType, DDisplay } from "../../../types/dtypes";
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
    // Check for precision.
    expect(queryByText("hello xyz")).toBeInTheDocument();
  });
});
