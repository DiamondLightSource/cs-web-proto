import React from "react";
import { shallow, ShallowWrapper } from "enzyme";

import { AlarmBorder } from "./alarmBorder";
import { vdouble } from "../../../types/vtypes/vtypes";

let wrapper: ShallowWrapper;
beforeEach((): void => {
  const alarmborder = (
    <AlarmBorder connected={true} value={vdouble(0)}>
      Children
    </AlarmBorder>
  );
  wrapper = shallow(alarmborder);
});

describe("AlarmBorder", (): void => {
  test("it renders a basic element", (): void => {
    expect(wrapper.text()).toContain("Children");
  });

  test("has Border class by default", (): void => {
    expect(wrapper.hasClass("Border"));
  });

  test("MajorAlarm class included on major alarm", (): void => {
    wrapper.setProps({ alarm: { severity: 2, status: 0, message: "" } });
    expect(wrapper.hasClass("MajorAlarm"));
  });
  test("MinorAlarm class included on major alarm", (): void => {
    wrapper.setProps({ alarm: { severity: 2, status: 0, message: "" } });
    expect(wrapper.hasClass("MinorAlarm"));
  });
});
