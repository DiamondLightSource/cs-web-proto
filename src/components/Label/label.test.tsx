import React from "react";
import { Label } from "./label";
import { shallow } from "enzyme";
import { create, ReactTestRenderer } from "react-test-renderer";

let snapshot: ReactTestRenderer;
let wrapper: ShallowWrapper;

beforeEach((): void => {
  const mock = (_: any): void => {
    // pass
  };
  const label = <Label text="hello" />;
  wrapper = shallow(label);
  snapshot = create(label);
});

describe("<Label Label />", (): void => {
  test("it matches the snapshot", (): void => {
    expect(snapshot.toJSON()).toMatchSnapshot();
  });

  test("it renders a basic element", (): void => {
    const label = wrapper.find("label");
    expect(wrapper.text()).toEqual("hello");
  });
});
