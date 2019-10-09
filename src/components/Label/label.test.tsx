import React from "react";
import { Label } from "./label";
import { shallow } from "enzyme";
import renderer from "react-test-renderer";

test("snapshot matches", (): void => {
  const readback = renderer.create(<Label text="hello" />);
  let json = readback.toJSON();
  expect(json).toMatchSnapshot();
});

it("renders a basic element", (): void => {
  const wrapper = shallow(<Label text="hello" />);
  expect(wrapper.text()).toEqual("hello");
});
