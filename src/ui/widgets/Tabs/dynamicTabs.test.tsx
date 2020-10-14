import React from "react";
import { FileDescription, TabState } from "../../../fileContext";
import { contextRender } from "../../../setupTests";
import { DynamicTabsComponent } from "./dynamicTabs";
// Import to ensure that all widgets are registered.
import { ensureWidgetsRegistered } from "..";
ensureWidgetsRegistered();

const TAB_ONE: FileDescription = {
  path: "one.json",
  macros: {},
  defaultProtocol: "pva"
};

describe("fileContext", (): void => {
  it("shows no tabs initially", (): void => {
    const { queryByText } = contextRender(
      <DynamicTabsComponent location="testing" />,
      {},
      {}
    );
    expect(queryByText(/.*no file loaded/)).toBeInTheDocument();
  });

  it("loads tab initially", (): void => {
    const initialTabs: TabState = {
      testing: {
        fileDetails: [["tab one", TAB_ONE]],
        selectedTab: 0
      }
    };
    const { queryByText } = contextRender(
      <DynamicTabsComponent location="testing" />,
      {},
      initialTabs
    );
    expect(queryByText("tab one")).toBeInTheDocument();
  });
});
