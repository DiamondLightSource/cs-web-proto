import React from "react";
import { shallow, ShallowWrapper } from "enzyme";
import { create, ReactTestRenderer } from "react-test-renderer";

import { DropDownComponent } from "./dropDown";

let snapshot: ReactTestRenderer;
let wrapper: ShallowWrapper;

beforeEach((): void => {
  const grouping = (
    <DropDownComponent title={"Test"}>Test Text</DropDownComponent>
  );
  wrapper = shallow(grouping);
  snapshot = create(grouping);
});

describe("<DropDownComponent />", (): void => {
  test("it matches the snapshot", (): void => {
    expect(snapshot.toJSON()).toMatchSnapshot();
  });
  test("it is a details HTML object", (): void => {
    expect(wrapper.type()).toEqual("details");
  });
  test("it has a summary object with the given title", (): void => {
    expect(wrapper.childAt(0).type()).toEqual("summary");
    expect(wrapper.childAt(0).text()).toEqual("Test");
  });
  test("it has a div child which renders the children", (): void => {
    expect(wrapper.childAt(1).type()).toEqual("div");
    expect(wrapper.childAt(1).text()).toEqual("Test Text");
  });
});
