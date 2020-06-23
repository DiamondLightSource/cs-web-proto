import React from "react";
import { GroupingContainerComponent } from "./groupingContainer";
import { shallow, ShallowWrapper } from "enzyme";
import { create, ReactTestRenderer } from "react-test-renderer";
import { MacroContext } from "../../../types/macros";

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

  test("it is a div HTML object", (): void => {
    expect(wrapper.type()).toEqual(MacroContext.Provider);
    expect(wrapper.childAt(0).type()).toEqual("div");
  });

  test("it renders child div with text", (): void => {
    const childText = "Testing Child Component";
    const groupingWithChild = (
      <GroupingContainerComponent name={"Test"}>
        <div>{childText}</div>
      </GroupingContainerComponent>
    );
    const wrapperWithChild = shallow(groupingWithChild);
    expect(wrapperWithChild.childAt(0).text()).toEqual(childText);
  });
});
