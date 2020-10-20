import React from "react";
import renderer, { ReactTestRenderer } from "react-test-renderer";
import { PolylineComponent } from "./polyline";
import { ShapeComponent } from "../Shape/shape";
import { Color } from "../../../types/color";

const PolylineRenderer = (polylineProps: any): ReactTestRenderer => {
  return renderer.create(
    <PolylineComponent {...polylineProps} readonly={true} />
  );
};

test("matches snapshot", (): void => {
  const testRenderer = PolylineRenderer({});
  expect(testRenderer).toMatchSnapshot();
});

test("properties are added to polyline component", (): void => {
  const polylineProps = {
    width: 20,
    lineWidth: 4
  };

  const testRenderer = PolylineRenderer(polylineProps);

  const labelProps = testRenderer.root.findByType(ShapeComponent).props;

  expect(labelProps.shapeWidth).toBe("20px");
  expect(labelProps.shapeHeight).toBe("4px");
  expect(labelProps.backgroundColor).toEqual(Color.CYAN);
});
