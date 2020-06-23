import React from "react";
import { shallow, ShallowWrapper } from "enzyme";
import { create, ReactTestRenderer } from "react-test-renderer";
import { DisplayComponent } from "./display";
import { Label } from "../Label/label";
import { RelativePosition } from "../../../types/position";
import { MacroMap } from "../../../types/macros";

let snapshot: ReactTestRenderer;
let wrapper: ShallowWrapper;

// Mock useSelector to return a 'global' macro map.
jest.mock("react-redux", (): object => {
  return {
    useSelector: (): MacroMap => ({
      A: "B",
      C: "D"
    }),
    useDispatch: (): void => {}
  };
});

beforeEach((): void => {
  const display = (
    <DisplayComponent id="id1">
      <Label text="hello" position={new RelativePosition()} />
    </DisplayComponent>
  );
  wrapper = shallow(display);
  snapshot = create(display);
});

describe("<Display />", (): void => {
  test("it matches the snapshot", (): void => {
    expect(snapshot.toJSON()).toMatchSnapshot();
  });

  test("it renders a div", (): void => {
    expect(wrapper.childAt(0).type()).toEqual("div");
  });
});
