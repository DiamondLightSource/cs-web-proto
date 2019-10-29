import React from "react";
import { shallow, ShallowWrapper } from "enzyme";

import { CopyWrapper } from "./copyWrapper";
import Popover from "react-tiny-popover";
import { vstring } from "../../vtypes/string";

let wrapper: ShallowWrapper;
let wrappedElement: ShallowWrapper;

beforeEach((): void => {
  const copywrapper = (
    <CopyWrapper pvName="pv" connected={true} value={vstring("hello")}>
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
