import React from "react";
import { Readback } from "./readback";
import { shallow } from "enzyme";
import renderer from "react-test-renderer";
import { vstring } from "../../vtypes/string";
import { stringToVtype } from "../../vtypes/utils";

test("snapshot matches", (): void => {
  const readback = renderer.create(
    <Readback connected={true} value={vstring("hello")} />
  );
  let json = readback.toJSON();
  expect(json).toMatchSnapshot();
});

it("renders a basic element", (): void => {
  const wrapper = shallow(
    <Readback connected={true} value={vstring("hello")} />
  );
  expect(wrapper.text()).toEqual("hello");
});

it("applies precision to numbers", (): void => {
  const wrapper = shallow(
    <Readback
      connected={true}
      value={stringToVtype("3.14159265359")}
      precision={2}
    />
  );
  expect(wrapper.text()).toEqual("3.14");
});
