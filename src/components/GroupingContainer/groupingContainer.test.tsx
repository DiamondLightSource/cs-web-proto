import React from "react";
import { GroupingContainerComponent } from "./groupingContainer";
import { shallow, ShallowWrapper } from "enzyme";
import { create, ReactTestRenderer } from "react-test-renderer";

let snapshot: ReactTestRenderer;
let wrapper: ShallowWrapper;

beforeEach((): void => {
  const grouping = <GroupingContainerComponent name={"Test"} />;
  wrapper = shallow(grouping);
  snapshot = create(grouping);
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

  test("it renders child div with text", (): void => {
    let childText = "Testing Child Component";
    let groupingWithChild = (
      <GroupingContainerComponent name={"Test"}>
        <div>{childText}</div>
      </GroupingContainerComponent>
    );
    let wrapperWithChild = shallow(groupingWithChild);
    expect(
      wrapperWithChild
        .childAt(1)
        .childAt(0)
        .text()
    ).toEqual(childText);
  });
});
