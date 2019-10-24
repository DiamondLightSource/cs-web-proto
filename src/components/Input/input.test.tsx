import React from "react";
import { InputComponent, InputProps } from "./input";
import { configure, shallow, ShallowWrapper } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { create, ReactTestRenderer } from "react-test-renderer";

configure({ adapter: new Adapter() });

let snapshot: ReactTestRenderer;
let wrapper: ShallowWrapper<InputProps>;

beforeEach((): void => {
  const mock = (_: any): void => {
    // pass
  };
  const input = (
    <InputComponent
      pvName="pv"
      value="hello"
      onKeyDown={mock}
      onChange={mock}
      onBlur={mock}
      onClick={mock}
      readonly={false}
    />
  );
  wrapper = shallow(input);
  snapshot = create(input);
});

describe("<Input Input />", (): void => {
  test("it matches the snapshot", (): void => {
    expect(snapshot.toJSON()).toMatchSnapshot();
  });

  test("it renders a basic element", (): void => {
    const input = wrapper.find("input");
    expect(input.get(0).type).toEqual("input");
    expect(input.prop("value")).toEqual("hello");
  });
});
