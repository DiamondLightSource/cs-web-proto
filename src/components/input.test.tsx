import React from "react";
import { Input, InputProps } from "./input";
import { shallow } from "enzyme";

it("renders a basic element", (): void => {
  const mock = <jest.mock<typeof InputProps.onKeyDown>>InputProps.onKeyDown;
  const input = shallow(<Input 
    type="text"
    value="hello"
    onKeyDown={mock}
    onChange={mock}
    onBlur={mock}
    onClick={mock} />
    );
  expect(input.text()).toEqual("Hello");
});
