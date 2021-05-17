import React from "react";
import { render, screen } from "@testing-library/react";
import { SimpleSymbolComponent } from "./simpleSymbol";
import { DType } from "../../../types/dtypes";

const fakeValue = new DType({ stringValue: "Fake value" });

describe("<Symbol />", (): void => {
  test("img element rendered", (): void => {
    const symbolProps = {
      imageFile: "img 1.gif"
    };

    render(<SimpleSymbolComponent {...(symbolProps as any)} />);

    expect(screen.queryByAltText("Simple symbol widget")).toBeInTheDocument();
  });

  test("matches snapshot", (): void => {
    const symbolProps = {
      showBooleanLabel: true,
      imageFile: "img 1.gif",
      value: fakeValue
    };
    const { asFragment } = render(
      <SimpleSymbolComponent {...(symbolProps as any)} />
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
