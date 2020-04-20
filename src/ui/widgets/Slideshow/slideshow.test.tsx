import React from "react";
import { mount, ReactWrapper } from "enzyme";
import { create, ReactTestRenderer } from "react-test-renderer";
import { InferWidgetProps } from "../propTypes";

import { SlideshowProps, SlideshowComponent } from "./slideshow";

let snapshot: ReactTestRenderer;
let mounted: ReactWrapper<InferWidgetProps<typeof SlideshowProps>>;

beforeEach((): void => {
  const slideshow = (
    <SlideshowComponent>
      <div id="child-element">Child 1</div>
      <div id="child-element">Child 2</div>
      <div id="child-element">Child 3</div>
    </SlideshowComponent>
  );
  snapshot = create(slideshow);
  mounted = mount(slideshow);
});

describe("<Slideshow />", (): void => {
  test("it matches the snapshot", (): void => {
    expect(snapshot.toJSON()).toMatchSnapshot();
  });

  test("it renders only one child component", () => {
    // console.log(mounted.find("#child-element").debug());
    expect(mounted.find("#child-element")).toHaveLength(1);
  });

  test("it renders the first child on startup", () => {
    expect(mounted.find("#child-element").text()).toEqual("Child 1");
    expect(mounted.find("SwitchableWidget").prop("index")).toEqual(0);
  });

  // Using the index as I know this works and the transition seems to slow
  // down the actual rendering of the new div
  test("next button iterates index", () => {
    mounted.find("#next-button").simulate("click");
    expect(mounted.find("SwitchableWidget").prop("index")).toEqual(1);
  });
  test("next button loops index on overflow", (): void => {
    mounted.find("#next-button").simulate("click");
    expect(mounted.find("SwitchableWidget").prop("index")).toEqual(1);
    mounted.find("#next-button").simulate("click");
    expect(mounted.find("SwitchableWidget").prop("index")).toEqual(2);
    mounted.find("#next-button").simulate("click");
    expect(mounted.find("SwitchableWidget").prop("index")).toEqual(0);
  });
  test("previous button loops around on underflow", (): void => {
    mounted.find("#prev-button").simulate("click");
    expect(mounted.find("SwitchableWidget").prop("index")).toEqual(2);
    mounted.find("#prev-button").simulate("click");
    expect(mounted.find("SwitchableWidget").prop("index")).toEqual(1);
    mounted.find("#prev-button").simulate("click");
    expect(mounted.find("SwitchableWidget").prop("index")).toEqual(0);
  });
});
