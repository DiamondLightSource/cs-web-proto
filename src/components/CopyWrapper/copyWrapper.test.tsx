import React from "react";
import { shallow, ShallowWrapper } from "enzyme";

import { CopyWrapper } from "./copyWrapper";
import Popover from "react-tiny-popover";

let wrapper: ShallowWrapper;
let wrappedElement: ShallowWrapper;

beforeEach((): void => {
  // Get current time, separate into seconds and nanoseconds
  let currentTime = new Date(0);
  let seconds = Math.round(currentTime.getTime() / 1000),
    nanoseconds = Math.round(currentTime.getTime() % 1000);

  const copywrapper = (
    <CopyWrapper
      pvName="pv"
      connected={true}
      value={{
        type: "String",
        value: "hello",
        time: {
          secondsPastEpoch: seconds,
          nanoseconds: nanoseconds,
          userTag: 0
        }
      }}
    >
      Testing Copy Wrapper
    </CopyWrapper>
  );
  wrapper = shallow(copywrapper);
  wrappedElement = wrapper.find(".Children").childAt(0);
});

describe("<CopyWrapper>", (): void => {
  test("it contains a Popover", (): void => {
    const popover = wrapper.find(Popover);
    expect(popover.name()).toEqual("Popover");
  });
  test("it contains one child element", (): void => {
    const children = wrapper.find(".Children");
    expect(children).toHaveLength(1);
  });

  test("it renders text", (): void => {
    expect(wrappedElement.text()).toEqual("Testing Copy Wrapper");
  });

  // How do we test the popover content? It renders on the
  // <body> element not the Popover element.
});
