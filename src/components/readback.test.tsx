import React from "react";
import { Readback } from "./readback";
import { shallow } from "enzyme";
import renderer from "react-test-renderer";

test("snapshot matches", (): void => {
  const readback = renderer.create(
    <Readback pvName={"mypv"} value={{ type: "blah", value: "hello" }} />
  );
  let json = readback.toJSON();
  expect(json).toMatchSnapshot();
});

it("renders a basic element", (): void => {
  const wrapper = shallow(
    <Readback pvName={"mypv"} value={{ type: "blah", value: "hello" }} />
  );
  expect(wrapper.text()).toEqual("mypv: hello");
});
