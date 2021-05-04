import React from "react";
import { GroupBoxComponent } from "./groupBox";
import { shallow, ShallowWrapper } from "enzyme";
import { create, ReactTestRenderer } from "react-test-renderer";
import { Color } from "../../../types/color";

let snapshot: ReactTestRenderer;
let wrapper: ShallowWrapper;

beforeEach((): void => {
  const grouping = <GroupBoxComponent name={"Test"} />;
  wrapper = shallow(grouping);
});

describe("<GroupingContainerComponent />", (): void => {
  test("it matches the snapshot", (): void => {
    snapshot = create(
      <GroupBoxComponent name={"Test"} backgroundColor={Color.WHITE} />
    );
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
    const childText = "Testing Child Component";
    const groupingWithChild = (
      <GroupBoxComponent name={"Test"}>
        <div>{childText}</div>
      </GroupBoxComponent>
    );
    const wrapperWithChild = shallow(groupingWithChild);
    expect(wrapperWithChild.childAt(1).childAt(0).text()).toEqual(childText);
  });
});
