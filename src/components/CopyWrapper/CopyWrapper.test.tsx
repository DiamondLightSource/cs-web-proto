import React from "react";
import { CopyWrapper } from "./CopyWrapper";
import { shallow, ShallowWrapper } from "enzyme";

let wrapper: ShallowWrapper;
beforeEach((): void => {
  // Get current time, separate into seconds and nanoseconds
  let currentTime = new Date(0);
  let seconds = Math.round(currentTime.getTime() / 1000),
    nanoseconds = Math.round(currentTime.getTime() % 1000);

  const copywrapper = (
    <CopyWrapper
      pvName="pv"
      value="hello"
      timestamp={{
        secondsPastEpoch: seconds,
        nanoseconds: nanoseconds,
        userTag: 0
      }}
    >
      Testing Copy Wrapper
    </CopyWrapper>
  );
  wrapper = shallow(copywrapper);
});

describe("<CopyWrapper>", (): void => {
  test("it renders a basic element", (): void => {
    expect(wrapper.text()).toContain("Testing Copy Wrapper");
  });

  test("it contains the date", (): void => {
    expect(wrapper.text()).toContain(new Date(0));
  });

  test("it contains the pv name", (): void => {
    expect(wrapper.text()).toContain("pv");
  });
  test("it contains the value", (): void => {
    expect(wrapper.text()).toContain("hello");
  });
});
