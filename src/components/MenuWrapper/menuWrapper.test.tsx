import React from "react";
import { shallow, ShallowWrapper } from "enzyme";

import { Items, MenuWrapper } from "./menuWrapper";

let wrapper: ShallowWrapper;

beforeEach((): void => {
  let item: Items = {
    actions: { executeAsOne: false, actions: [] },
    label: "empty"
  };
  let items: Items[] = [item];
  const menuWrapper = (
    <MenuWrapper pvName="pv" items={items}>
      Children
    </MenuWrapper>
  );
  wrapper = shallow(menuWrapper);
});

describe("<MenuWrapper>", (): void => {
  test("it renders a basic element", (): void => {
    expect(wrapper.text()).toContain("Children");
  });
  test("it contains one child element", (): void => {
    const children = wrapper.find("div");
    expect(children).toHaveLength(1);
    expect(children.find("div")).toHaveLength(1);
  });
});
