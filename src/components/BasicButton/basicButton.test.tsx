import React from "react";
import { BasicButtonComponent, BasicButtonProps } from "./basicButton";
import { configure, shallow, ShallowWrapper } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { create, ReactTestRenderer } from "react-test-renderer";

configure({ adapter: new Adapter() });

let snapshot: ReactTestRenderer;
let basicButtonWrapper: ShallowWrapper<BasicButtonProps>;
beforeEach((): void => {
  const basicButton = <BasicButtonComponent text={"hello"} />;
  snapshot = create(basicButton);
  basicButtonWrapper = shallow(basicButton);
});

describe("<BasicButton />", (): void => {
  test("it matches the snapshot", (): void => {
    expect(snapshot.toJSON()).toMatchSnapshot();
  });

  test("it renders a basic element", (): void => {
    const button = basicButtonWrapper.find("button");
    expect(button.get(0).type).toEqual("button");
    expect(button.text()).toEqual("hello");
  });
});
