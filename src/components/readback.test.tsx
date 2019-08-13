import React from "react";
import { Readback } from "./readback";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });
it("renders a basic element", (): void => {
  const wrapper = shallow(
    <Readback pvName={"mypv"} value={{ type: "blah", value: "hello" }} />
  );
  expect(wrapper.text()).toEqual("mypv: hello");
});
