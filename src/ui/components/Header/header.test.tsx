import React from "react";
import { ReactTestRenderer, create } from "react-test-renderer";
import { Header } from "./header";

describe("<Header />", (): void => {
  test("it matches the snapshot", (): void => {
    const snapshot: ReactTestRenderer = create(<Header />);
    expect(snapshot.toJSON()).toMatchSnapshot();
  });
});
