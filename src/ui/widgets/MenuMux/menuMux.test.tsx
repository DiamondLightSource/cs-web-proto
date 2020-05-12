import React from "react";
import { MenuMuxComponent, MenuMuxProps } from "./menuMux";
import { shallow, ShallowWrapper } from "enzyme";
import { create, ReactTestRenderer } from "react-test-renderer";

let snapshot: ReactTestRenderer;
let wrapper: ShallowWrapper<MenuMuxProps>;

beforeEach((): void => {
  const mock = (_: any): void => {
    // pass
  };
  const menuMux = (
    <MenuMuxComponent
      onChange={mock}
      values={{ A: "a", B: "b" }}
      selected={"a"}
    />
  );
  wrapper = shallow(menuMux);
  snapshot = create(menuMux);
});

describe("<MenuMux />", (): void => {
  test("it matches the snapshot", (): void => {
    expect(snapshot.toJSON()).toMatchSnapshot();
  });

  test("it renders a basic element", (): void => {
    const select = wrapper.find("select");
    expect(select.get(0).type).toEqual("select");
    expect(select.prop("value")).toEqual("a");
  });

  test("it renders all the choices", (): void => {
    const options = wrapper.find("option");
    expect(options.length).toBe(2);
  });
});
