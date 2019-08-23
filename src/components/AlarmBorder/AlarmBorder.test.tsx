import React from "react";
import { shallow, ShallowWrapper } from "enzyme";

import { AlarmBorder } from "./AlarmBorder";

let wrapper: ShallowWrapper;
beforeEach((): void => {
  const alarmborder = (
    <AlarmBorder
      alarm={{
        severity: 0,
        status: 0,
        message: ""
      }}
    >
      Children
    </AlarmBorder>
  );
  wrapper = shallow(alarmborder);
});

describe("<CopyWrapper>", (): void => {
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
