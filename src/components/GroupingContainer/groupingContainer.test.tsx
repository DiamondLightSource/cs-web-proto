import React from "react";
import { GroupingContainerComponent } from "./groupingContainer";
import { shallow, ShallowWrapper } from "enzyme";
import { create, ReactTestRenderer } from "react-test-renderer";

let snapshot: ReactTestRenderer;
let wrapper: ShallowWrapper;

beforeEach((): void => {
  const label = <GroupingContainerComponent name={"Test"} />;
  wrapper = shallow(label);
  snapshot = create(label);
});

describe("<GroupingContainerComponent />", (): void => {
  test("it matches the snapshot", (): void => {
    expect(snapshot.toJSON()).toMatchSnapshot();
  });

  test("it is a fieldset HTML object", (): void => {
    expect(wrapper.type()).toEqual("fieldset");
  });

  test("it has a legend element", (): void => {
    expect(wrapper.childAt(0).type()).toEqual("legend");
  });

  test("name props is text of legend", (): void => {
    expect(wrapper.childAt(0).text()).toEqual("Test");
  });

  test("it has a div for other children", (): void => {
    expect(wrapper.childAt(1).type()).toEqual("div");
  });
});
