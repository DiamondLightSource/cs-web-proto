import React from "react";
import { ActionButtonComponent, ActionButtonProps } from "./actionButton";
import { shallow, ShallowWrapper } from "enzyme";
import { create, ReactTestRenderer } from "react-test-renderer";

let snapshot: ReactTestRenderer;
let actionButtonWrapper: ShallowWrapper<ActionButtonProps>;
beforeEach((): void => {
  const mock = (_: any): void => {
    // pass
  };
  const actionButton = <ActionButtonComponent text={"hello"} onClick={mock} />;
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
