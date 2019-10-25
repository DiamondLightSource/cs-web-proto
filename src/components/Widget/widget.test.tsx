import React from "react";
import { mount } from "enzyme";

import { Widget } from "./widget";
import { LabelComponent } from "../Label/label";
import { MacroProps } from "../MacroWrapper/macroWrapper";

let TestLabel = (): JSX.Element => {
  return <LabelComponent text="Test" />;
};

// Mock the useMacros hook as otherwise we'd have to provide
// a store for it to use.
jest.mock("../MacroWrapper/macroWrapper", (): object => {
  return {
    useMacros: (props: MacroProps): MacroProps => props
  };
});

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
    //TestLabel
    let c1 = component.childAt(0);

    expect(component.children()).toHaveLength(1);
    //Label
    let c2 = c1.childAt(0);
    expect(c2.children()).toHaveLength(1);
    // div has no child
    let c3 = c2.childAt(0);
    expect(c3.children()).toHaveLength(0);
    expect(c3.type()).toEqual("div");
    expect(c3.text()).toEqual("Test");
  });
  test("it has copywrapper", (): void => {
    let component = mount(
      <Widget
        baseWidget={TestLabel}
        containerStyling={{ position: "relative" }}
        wrappers={{ copywrapper: true }}
      />
    );
    expect(component.childAt(0).name()).toEqual("CopyWrapper");
  });

  test("it has alarmborder", (): void => {
    let component = mount(
      <Widget
        baseWidget={TestLabel}
        containerStyling={{ position: "relative" }}
        wrappers={{ alarmborder: true }}
      />
    );
    expect(component.childAt(0).name()).toEqual("AlarmBorder");
  });

  test("it has alarmborder and copywrapper", (): void => {
    let component = mount(
      <Widget
        baseWidget={TestLabel}
        containerStyling={{ position: "relative" }}
        wrappers={{ alarmborder: true, copywrapper: true }}
      />
    );
    expect(component.childAt(0).name()).toEqual("AlarmBorder");
    // Alarm children div
    let c1 = component.childAt(0);
    // Copy wrapper
    let c2 = c1.childAt(0);
    expect(c2.childAt(0).name()).toEqual("CopyWrapper");
  });
});
