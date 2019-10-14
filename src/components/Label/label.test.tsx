import React from "react";
import { Label } from "./label";
import { shallow, ShallowWrapper } from "enzyme";
import { create, ReactTestRenderer } from "react-test-renderer";

let snapshot: ReactTestRenderer;
let wrapper: ShallowWrapper;

beforeEach((): void => {
  const label = <Label text="hello" />;
  wrapper = shallow(label);
  snapshot = create(label);
});

describe("<Label Label />", (): void => {
  test("it matches the snapshot", (): void => {
    expect(snapshot.toJSON()).toMatchSnapshot();
  });

  test("it renders a basic element", (): void => {
    expect(wrapper.text()).toEqual("hello");
  });
});
