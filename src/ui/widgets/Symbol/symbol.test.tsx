import React from "react";
import { render, screen } from "@testing-library/react";
import { SymbolComponent } from "./symbol";
import { DType } from "../../../types/dtypes";

const fakeValue = new DType({ stringValue: "Fake value" });

describe("<Symbol />", (): void => {
  test("label is not shown if showLabel is false", (): void => {
    const symbolProps = {
      showBooleanLabel: false,
      imageFile: "img 1.gif"
    };

    render(<SymbolComponent {...(symbolProps as any)} />);

    expect(screen.queryByText("Fake value")).not.toBeInTheDocument();
  });

  test("label is added", (): void => {
    const symbolProps = {
      showBooleanLabel: true,
      imageFile: "img 1.gif",
      value: fakeValue
    };
    render(<SymbolComponent {...(symbolProps as any)} />);

    expect(screen.getByText("Fake value")).toBeInTheDocument();
  });

  test("matches snapshot", (): void => {
    const symbolProps = {
      showBooleanLabel: true,
      imageFile: "img 1.gif",
      value: fakeValue
    };
    const { asFragment } = render(
      <SymbolComponent {...(symbolProps as any)} />
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
