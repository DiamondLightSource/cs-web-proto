import React from "react";
import { fileContextRender } from "../../../setupTests";
import { DynamicTabsComponent } from "./dynamicTabs";

describe("fileContext", (): void => {
  it("shows no tabs initially", (): void => {
    const { queryByText } = fileContextRender(
      <DynamicTabsComponent location="testing" />,
      {},
      {}
    );
    expect(queryByText(/.*no file loaded/)).toBeInTheDocument();
  });
});
