import React from "react";
import { mount, ReactWrapper } from "enzyme";
import copyToClipboard from "clipboard-copy";
import Popover from "react-tiny-popover";

import { TooltipWrapper } from "./tooltipWrapper";
import { vstring } from "../../../types/vtypes/string";

jest.mock("clipboard-copy", () => {
  return jest.fn((a: string) => Promise.resolve());
});
(copyToClipboard as jest.Mock).mockImplementation(() => Promise.resolve());

let wrapper: ReactWrapper;
let wrappedElement: ReactWrapper;

beforeEach((): void => {
  const tooltipWrapper = (
    <TooltipWrapper
      pvName="pv"
      // eslint-disable-next-line no-template-curly-in-string
      tooltip="${pvName}"
      connected={true}
      value={vstring("hello")}
    >
      Testing Tooltip Wrapper
    </TooltipWrapper>
  );
  wrapper = mount(tooltipWrapper);
  wrappedElement = wrapper.childAt(0);
});

describe("TooltipWrapper", (): void => {
  test("it contains a Popover after mouse down click", (): void => {
    wrapper.simulate("mouseDown", { button: 1 });
    const popover = wrapper.find(Popover);
    expect(popover.name()).toEqual("Popover");
  });
  test("it contains one child element", (): void => {
    const children = wrapper.children();
    expect(children).toHaveLength(1);
  });

  test("it renders text", (): void => {
    expect(wrappedElement.text()).toEqual("Testing Tooltip Wrapper");
  });

  // How do we test the popover content? It renders on the
  // <body> element not the Popover element.
});
