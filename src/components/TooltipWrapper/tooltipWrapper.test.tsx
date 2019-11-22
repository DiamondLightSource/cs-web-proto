import React from "react";
import { shallow, ShallowWrapper } from "enzyme";

import { TooltipWrapper } from "./tooltipWrapper";
import Popover from "react-tiny-popover";
import { vstring } from "../../vtypes/string";

let wrapper: ShallowWrapper;
let wrappedElement: ShallowWrapper;

beforeEach((): void => {
  const tooltipWrapper = (
    <TooltipWrapper
      pvName="pv"
      // eslint-disable-next-line no-template-curly-in-string
      resolvedTooltip="${pvName}"
      connected={true}
      value={vstring("hello")}
    >
      Testing Tooltip Wrapper
    </TooltipWrapper>
  );
  wrapper = shallow(tooltipWrapper);
  wrappedElement = wrapper.childAt(0);
});

describe("TooltipWrapper", (): void => {
  test("it contains a Popover", (): void => {
    const popover = wrapper.find(Popover);
    expect(popover.name()).toEqual("Popover");
  });
  test("it contains one child element", (): void => {
    const children = wrapper.children();
    expect(children).toHaveLength(1);
  });

  test("it renders text", (): void => {
    expect(wrappedElement.childAt(0).text()).toEqual("Testing Tooltip Wrapper");
  });

  // How do we test the popover content? It renders on the
  // <body> element not the Popover element.
});
