import React from "react";
import renderer, { ReactTestRendererJSON } from "react-test-renderer";
import { SymbolComponent } from "./symbol";

const renderSymbol = (symbolProps: any): ReactTestRendererJSON => {
  return renderer
    .create(<SymbolComponent {...symbolProps} readonly={true} />)
    .toJSON() as ReactTestRendererJSON;
};

describe("properties are added to symbol", (): void => {
  test("label is shown if showLabel is true", (): void => {
    const symbolProps = {
      name: "test name",
      showLabel: true
    };

    const renderedSymbol = renderSymbol(symbolProps);
    const labelChild = renderedSymbol.children[1] as ReactTestRendererJSON;
    expect(labelChild.children[0]).toBe("test name");
    expect(labelChild.children.length).toBe(1);
    expect(labelChild.props.style.visibility).toBe("visible");
    expect(labelChild.props.style.backgroundColor).toBe(
      "rgba(255, 255, 255, 255)"
    );
  });

  test("label is not shown if showLabel is false", (): void => {
    const symbolProps = {
      name: "test name"
    };

    const renderedSymbol = renderSymbol(symbolProps);

    expect(renderedSymbol.children.length).toBe(1);
  });
});
