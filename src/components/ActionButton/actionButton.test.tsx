import React from "react";
import { BasicActionButton, BasicActionButtonProps } from "./actionButton";
import { configure, shallow, ShallowWrapper } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { create, ReactTestRenderer } from "react-test-renderer";

configure({ adapter: new Adapter() });

let snapshot: ReactTestRenderer;
let actionButtonWrapper: ShallowWrapper<BasicActionButtonProps>;
beforeEach((): void => {
  const mock = (_: any): void => {
    // pass
  };
  const actionButton = <BasicActionButton text={"hello"} onClick={mock} />;
  snapshot = create(actionButton);
  actionButtonWrapper = shallow(actionButton);
});

describe("<ActionButton />", (): void => {
  test("it matches the snapshot", (): void => {
    expect(snapshot.toJSON()).toMatchSnapshot();
  });

  test("it renders a basic element", (): void => {
    const button = actionButtonWrapper.find("button");
    expect(button.get(0).type).toEqual("button");
    expect(button.text()).toEqual("hello");
  });
});
