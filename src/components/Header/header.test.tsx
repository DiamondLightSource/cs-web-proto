import React from "react";
import '@testing-library/jest-dom';
import { contextRender } from "@dls-controls/cs-web-lib";
import { Header } from "./header";

describe("<Header />", (): void => {
  test("it renders the title", (): void => {
    const { getByText } = contextRender(<Header drawer={true} />);
    expect(getByText("cs-web-proto")).toBeInTheDocument();
  });
});
