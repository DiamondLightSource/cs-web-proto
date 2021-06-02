import React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react";
import { create } from "react-test-renderer";

import { SlideshowComponent } from "./slideshow";

const slideshow = (
  <SlideshowComponent>
    <div id="child-element">Child 1</div>
    <div id="child-element">Child 2</div>
    <div id="child-element">Child 3</div>
  </SlideshowComponent>
);

describe("<Slideshow />", (): void => {
  test("it matches the snapshot", (): void => {
    const snapshot = create(slideshow);
    expect(snapshot.toJSON()).toMatchSnapshot();
  });

  test("it renders only one child component", () => {
    const { queryByText } = render(slideshow);
    expect(queryByText("Child 1")).toBeInTheDocument();
    expect(queryByText("Child 2")).not.toBeInTheDocument();
  });

  // Using the index as I know this works and the transition seems to slow
  // down the actual rendering of the new div
  test("next button iterates index", async () => {
    const { getByText, queryByText } = render(slideshow);
    expect(queryByText("Child 2")).not.toBeInTheDocument();
    const nextButton = getByText("▶");
    fireEvent.click(nextButton);
    // Wait for transition.
    await waitFor(() => expect(queryByText("Child 2")).toBeInTheDocument());
  });
  test("previous button loops to last index", async () => {
    const { getByText, queryByText } = render(slideshow);
    expect(queryByText("Child 3")).not.toBeInTheDocument();
    const previousButton = getByText("◀");
    fireEvent.click(previousButton);
    // Wait for transition.
    await waitFor(() => expect(queryByText("Child 3")).toBeInTheDocument());
  });
});
