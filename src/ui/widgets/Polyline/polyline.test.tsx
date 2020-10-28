import React from "react";
import renderer, { ReactTestRenderer } from "react-test-renderer";
import { render } from "@testing-library/react";
import { PolylineComponent } from "./polyline";
import { ShapeComponent } from "../Shape/shape";
import { Color } from "../../../types/color";

const PolylineRenderer = (polylineProps: any): ReactTestRenderer => {
  return renderer.create(
    <PolylineComponent {...polylineProps} readonly={true} />
  );
};

describe("<PolylineComponent />", (): void => {
  test("matches snapshot", (): void => {
    const { asFragment } = render(
      <PolylineComponent
        {...({
          backgroundColor: Color.fromRgba(0, 255, 255),
          width: 50,
          lineWidth: 4,
          rotationAngle: 45
        } as any)}
      />
    );

    expect(asFragment()).toMatchSnapshot();
  });

  test("default properties are added to polyline component", (): void => {
    const polylineProps = {
      width: 20,
      lineWidth: 4,
      backgroundColor: Color.fromRgba(0, 255, 255)
    };

    const testRenderer = PolylineRenderer(polylineProps);

    const shapeProps = testRenderer.root.findByType(ShapeComponent).props;

    expect(shapeProps.shapeWidth).toBe("20px");
    expect(shapeProps.shapeHeight).toBe("4px");
    expect(shapeProps.backgroundColor.text).toEqual("rgba(0,255,255,255)");
    expect(shapeProps.visible).toBe(true);
  });

  test("props override default properties", (): void => {
    const polylineProps = {
      width: 15,
      lineWidth: 15,
      backgroundColor: Color.fromRgba(0, 255, 255),
      transparent: true,
      rotationAngle: 45,
      visible: false
    };

    const testRenderer = PolylineRenderer(polylineProps);

    const shapeProps = testRenderer.root.findByType(ShapeComponent).props;

    expect(shapeProps.backgroundColor.text).toBe(Color.TRANSPARENT.toString());
    expect(shapeProps.shapeTransform).toBe("rotate(45deg)");
    expect(shapeProps.visible).toBe(false);
  });
});
