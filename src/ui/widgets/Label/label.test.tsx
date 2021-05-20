import React from "react";
import { LabelComponent } from "./label";
import { render, screen } from "@testing-library/react";

describe("<Label />", (): void => {
  test("it matches the snapshot", (): void => {
    const { asFragment } = render(<LabelComponent text="hello" />);
    expect(asFragment()).toMatchSnapshot();
  });

  test("it renders a basic element", (): void => {
    render(<LabelComponent text="hello" />);
    expect(screen.getByText("hello")).toBeInTheDocument();
  });

  test("it handles transparent prop", (): void => {
    render(<LabelComponent text="hello" transparent={true} />);
    const label = screen.getByText("hello");
    // The text is in the span, not the parent div.
    if (label.parentElement && "style" in label.parentElement) {
      expect(label.parentElement.style).toHaveProperty(
        "backgroundColor",
        "transparent"
      );
    }
    expect.assertions(1);
  });
});
