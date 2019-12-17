import React from "react";
import { shallow, ShallowWrapper } from "enzyme";

import { MenuWrapper } from "./menuWrapper";

let wrapper: ShallowWrapper;

// Mock the useHistory hook
jest.mock("react-router-dom", (): object => ({
  useHistory: (): object => ({
    push: jest.fn()
  })
}));

beforeEach((): void => {
  const actions = { executeAsOne: false, actions: [] };
  const menuWrapper = (
    <MenuWrapper pvName="pv" actions={actions}>
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
