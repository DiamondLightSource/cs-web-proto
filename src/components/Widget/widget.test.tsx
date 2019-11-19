import React from "react";
import { mount } from "enzyme";

import { Widget, PVWidget } from "./widget";
import { LabelComponent } from "../Label/label";
import { MacroProps } from "../../hooks/useMacros";
import { vdouble } from "../../vtypes/vtypes";
import { useConnection } from "../../hooks/useConnection";
import { RuleProps } from "../../hooks/useRules";
import { TooltipWrapper } from "../TooltipWrapper/tooltipWrapper";

// Mock the useMacros hook as otherwise we'd have to provide
// a store for it to use.
jest.mock("../../hooks/useMacros", (): object => {
  return {
    useMacros: (props: MacroProps): MacroProps => props
  };
});
// Mock useRules.
jest.mock("../../hooks/useRules", (): object => {
  return {
    useRules: (props: RuleProps): RuleProps => props
  };
});
// Slightly elaborate mocking of useConnection.
jest.mock("../../hooks/useConnection", (): object => ({
  useConnection: jest.fn()
}));
// This has to be done in a second step because Jest does the
// mocking before we have access to other imports (vdouble).
(useConnection as jest.Mock).mockImplementation((pvName: string): any => {
  const val = vdouble(0);
  return [pvName, true, false, val];
});

let TestLabel = (): JSX.Element => {
  return <LabelComponent text="Test" />;
};

describe("<Widget />", (): void => {
  let component = mount(
    <Widget
      baseWidget={TestLabel}
      containerStyling={{ position: "relative" }}
    />
  );

  test("it retains label text", (): void => {
    expect(component.text()).toEqual("Test");
  });

  test("it has one child all the way down", (): void => {
    // Widget
    expect(component.children()).toHaveLength(1);
    // TooltipWrapper
    let c1 = component.childAt(0);
    expect(c1.type()).toEqual(TooltipWrapper);
    expect(c1.children()).toHaveLength(1);
    // div child of TooltipWrapper
    let c2 = c1.childAt(0);
    expect(c2.children()).toHaveLength(1);
    console.log(c2);
    expect(c2.type()).toEqual("div");
    // TestLabel
    let c3 = c2.childAt(0);
    expect(c3.type()).toEqual(TestLabel);
    expect(c3.children()).toHaveLength(1);
    // LabelComponent
    let c4 = c3.childAt(0);
    expect(c4.type()).toEqual(LabelComponent);
    // Finally the Label div
    let c5 = c4.childAt(0);
    expect(c5.type()).toEqual("div");
    // No further children
    expect(c5.children()).toHaveLength(0);
  });

  test("it has TooltipWrapper", (): void => {
    let component = mount(
      <PVWidget
        pvName="pv"
        baseWidget={TestLabel}
        containerStyling={{ position: "relative" }}
      />
    );
    expect(component.childAt(0).name()).toEqual("TooltipWrapper");
  });

  test("it has alarmborder", (): void => {
    let component = mount(
      <PVWidget
        pvName="pv"
        baseWidget={TestLabel}
        containerStyling={{ position: "relative" }}
        wrappers={{ alarmborder: true }}
      />
    );
    expect(component.childAt(0).name()).toEqual("AlarmBorder");
  });

  test("it has alarmborder and TooltipWrapper", (): void => {
    let component = mount(
      <PVWidget
        pvName="pv"
        baseWidget={TestLabel}
        containerStyling={{ position: "relative" }}
        wrappers={{ alarmborder: true }}
      />
    );
    expect(component.childAt(0).name()).toEqual("AlarmBorder");
    // Alarm children div
    let c1 = component.childAt(0);
    // Copy wrapper
    let c2 = c1.childAt(0);
    expect(c2.childAt(0).name()).toEqual("TooltipWrapper");
  });
});
