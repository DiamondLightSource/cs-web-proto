import React from "react";
import { mount } from "enzyme";

import { Widget, ConnectingComponent } from "./widget";
import { LabelComponent } from "./Label/label";
import { MacroProps } from "../hooks/useMacros";
import { vdouble } from "../../types/vtypes/vtypes";
import { useConnection } from "../hooks/useConnection";
import { TooltipWrapper } from "../components/TooltipWrapper/tooltipWrapper";
import { AnyProps } from "./widgetProps";

// Mock the useMacros hook as otherwise we'd have to provide
// a store for it to use.
jest.mock("../hooks/useMacros", (): object => {
  return {
    useMacros: (props: MacroProps): MacroProps => props
  };
});
// Mock useRules.
jest.mock("../hooks/useRules", (): object => {
  return {
    useRules: (props: AnyProps): AnyProps => props
  };
});
// Slightly elaborate mocking of useConnection.
jest.mock("../hooks/useConnection", (): object => ({
  useConnection: jest.fn()
}));
// This has to be done in a second step because Jest does the
// mocking before we have access to other imports (vdouble).
(useConnection as jest.Mock).mockImplementation((pvName: string): any => {
  const val = vdouble(0);
  return [pvName, true, false, val];
});

const TestLabel = (): JSX.Element => {
  return <LabelComponent text="Test" />;
};

describe("<Widget />", (): void => {
  const component = mount(
    <Widget baseWidget={TestLabel} positionStyle={{ position: "relative" }} />
  );

  test("it retains label text", (): void => {
    expect(component.text()).toEqual("Test");
  });

  test("it has one child all the way down", (): void => {
    // Widget
    expect(component.children()).toHaveLength(1);
    // ConnectingComponent
    const c1 = component.childAt(0);
    expect(c1.type()).toEqual(ConnectingComponent);
    expect(c1.children()).toHaveLength(1);
    // TooltipWrapper
    const c2 = c1.childAt(0);
    expect(c2.children()).toHaveLength(1);
    expect(c2.type()).toEqual(TooltipWrapper);
    // div child of TooltipWrapper
    const c3 = c2.childAt(0);
    expect(c3.type()).toEqual("div");
    expect(c3.children()).toHaveLength(1);
    // TestLabel
    const c4 = c3.childAt(0);
    expect(c4.type()).toEqual(TestLabel);
    // LabelComponent
    const c5 = c4.childAt(0);
    expect(c5.type()).toEqual(LabelComponent);
    // Finally the Label div
    const c6 = c5.childAt(0);
    expect(c6.type()).toEqual("div");
    // No further children
    expect(c6.text()).toEqual("Test");
  });

  test("it has TooltipWrapper", (): void => {
    const component = mount(
      <Widget
        pvName="pv"
        baseWidget={TestLabel}
        positionStyle={{ position: "relative" }}
      />
    );
    expect(
      component
        .childAt(0)
        .childAt(0)
        .name()
    ).toEqual("TooltipWrapper");
  });

  test("it has alarmborder", (): void => {
    const component = mount(
      <Widget
        pvName="pv"
        baseWidget={TestLabel}
        positionStyle={{ position: "relative" }}
        alarmBorder={true}
      />
    );
    expect(
      component
        .childAt(0)
        .childAt(0)
        .name()
    ).toEqual("AlarmBorder");
  });

  test("it has alarmborder and TooltipWrapper", (): void => {
    const component = mount(
      <Widget
        pvName="pv"
        baseWidget={TestLabel}
        positionStyle={{ position: "relative" }}
        alarmBorder={true}
      />
    );
    expect(
      component
        .childAt(0)
        .childAt(0)
        .name()
    ).toEqual("AlarmBorder");
    // Alarm children div
    const c1 = component.childAt(0).childAt(0);
    // Copy wrapper
    const c2 = c1.childAt(0);
    expect(c2.childAt(0).name()).toEqual("TooltipWrapper");
  });
});
