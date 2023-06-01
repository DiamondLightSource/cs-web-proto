import React from "react";
import { ReactTestRenderer, create } from "react-test-renderer";
import { Footer } from "./footer";

describe("<Footer />", (): void => {
  test("it matches the snapshot", (): void => {
    const snapshot: ReactTestRenderer = create(<Footer />);
    expect(snapshot.toJSON()).toMatchSnapshot();
  });
});
