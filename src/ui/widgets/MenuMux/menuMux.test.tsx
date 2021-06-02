import React from "react";
import { MenuMuxComponent } from "./menuMux";
import { create, ReactTestRenderer } from "react-test-renderer";
import { render } from "@testing-library/react";

let snapshot: ReactTestRenderer;

const menuMux = (
  <MenuMuxComponent
    onChange={jest.fn()}
    values={{ A: "a", B: "b" }}
    selected={"a"}
  />
);

beforeEach((): void => {
  snapshot = create(menuMux);
});

describe("<MenuMux />", (): void => {
  test("it matches the snapshot", (): void => {
    expect(snapshot.toJSON()).toMatchSnapshot();
  });

  test("it renders both options", (): void => {
    const { getByRole } = render(menuMux);
    const select = getByRole("combobox") as HTMLSelectElement;
    expect(select.childElementCount).toEqual(2);
  });
});
