import React from "react";
import { Readback } from "./readback";
import { shallow } from "enzyme";
import renderer from "react-test-renderer";

test("snapshot matches", (): void => {
  const readback = renderer.create(
    <Readback
      connected={true}
      value={{ type: "NTScalarDouble", value: "hello" }}
    />
  );
  let json = readback.toJSON();
  expect(json).toMatchSnapshot();
});

it("renders a basic element", (): void => {
  const wrapper = shallow(
    <Readback
      connected={true}
      value={{ type: "NTScalarDouble", value: "hello" }}
    />
  );
  expect(wrapper.text()).toEqual("hello");
});

it("applies precision to numbers", (): void => {
  const wrapper = shallow(
    <Readback
      connected={true}
      value={{ type: "NTScalarDouble", value: "3.14159265359" }}
      precision={2}
    />
  );
  expect(wrapper.text()).toEqual("3.14");
});
