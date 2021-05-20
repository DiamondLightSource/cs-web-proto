import React from "react";
import { SmartInputComponent } from "./input";
import { render } from "@testing-library/react";
import { DAlarm } from "../../../types/dtypes";
import { dstring } from "../../../testResources";

let input: JSX.Element;

beforeEach((): void => {
  input = (
    <SmartInputComponent
      pvName="pv"
      value={dstring("hello", DAlarm.MINOR)}
      connected={true}
      readonly={true}
      alarmSensitive={true}
    />
  );
});
describe("<Input />", (): void => {
  it("renders an input", (): void => {
    const { getByDisplayValue } = render(input);
    const renderedInput = getByDisplayValue("hello");
    expect(renderedInput).toBeInTheDocument();
    expect(renderedInput).toHaveStyle("color: var(--warning)");
    expect(renderedInput).toHaveClass("readonly");
  });
});
