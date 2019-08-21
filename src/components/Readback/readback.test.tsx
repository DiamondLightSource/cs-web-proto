import React from "react";
import { Readback } from "./readback";
import { shallow } from "enzyme";
import renderer from "react-test-renderer";

test("snapshot matches", (): void => {
  const readback = renderer.create(
    <Readback pvName={"mypv"} value={"hello"} />
  );
  let json = readback.toJSON();
  expect(json).toMatchSnapshot();
});

it("renders a basic element", (): void => {
  const wrapper = shallow(<Readback pvName={"mypv"} value={"hello"} />);
  expect(wrapper.contains(<div>mypv: hello</div>));
  //expect(wrapper.text()).toEqual("mypv: hello");
});
