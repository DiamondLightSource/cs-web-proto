import React from "react";
import renderer, { ReactTestRenderer } from "react-test-renderer";
import { SymbolComponent } from "./symbol";
import { LabelComponent } from "../Label/label";

const SymbolRenderer = (symbolProps: any): ReactTestRenderer => {
  return renderer.create(<SymbolComponent {...symbolProps} readonly={true} />);
};

describe("properties are added to symbol", (): void => {
  test("label is shown if showLabel is true", (): void => {
    const symbolProps = {
      name: "test name",
      showLabel: true
    };

    const testRenderer = SymbolRenderer(symbolProps);

    const label = testRenderer.root.findByType(LabelComponent);
    expect(label.props.visible).toBe(true);
    expect(label.props.backgroundColor).toEqual({
      a: 255,
      b: 255,
      g: 255,
      r: 255
    });
    expect(label.props.text).toBe("test name");

    const tree = testRenderer.toTree();
    expect(tree?.props.showLabel).toBe(true);
    expect(tree?.rendered?.rendered).toHaveLength(2);
    expect(tree?.rendered?.props.style.backgroundColor).toBe("transparent");
  });

  test("label is not shown if showLabel is false", (): void => {
    const symbolProps = {
      name: "test name",
      showLabel: false
    };

    const testRenderer = SymbolRenderer(symbolProps);

    expect(() => testRenderer.root.findByType(LabelComponent)).toThrow(
      'No instances found with node type: "LabelComponent"'
    );
  });
});
