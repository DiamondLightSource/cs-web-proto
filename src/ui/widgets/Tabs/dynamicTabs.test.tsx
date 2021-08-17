import React from "react";
import { FileDescription, TabState } from "../../../fileContext";
import { contextRender } from "../../../testResources";
import { DynamicTabsComponent } from "./dynamicTabs";
// Import to ensure that all widgets are registered.
import { ensureWidgetsRegistered } from "..";
import { fireEvent, waitFor } from "@testing-library/react";
ensureWidgetsRegistered();

const TAB_ONE: FileDescription = {
  path: "one.json",
  macros: {},
  defaultProtocol: "pva"
};

const TAB_TWO: FileDescription = {
  path: "two.json",
  macros: {},
  defaultProtocol: "pva"
};

const ONE_TAB_STATE: TabState = {
  testing: {
    fileDetails: [["tab one", TAB_ONE]],
    selectedTab: 0
  }
};

const TWO_TAB_STATE: TabState = {
  testing: {
    fileDetails: [
      ["tab one", TAB_ONE],
      ["tab two", TAB_TWO]
    ],
    selectedTab: 0
  }
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
    const { queryByText } = contextRender(
      <DynamicTabsComponent location="testing" />,
      {},
      ONE_TAB_STATE
    );
    expect(queryByText("tab one")).toBeInTheDocument();
  });

  it("closes selected tab on middle click", async (): Promise<void> => {
    const { queryByText } = contextRender(
      <DynamicTabsComponent location="testing" />,
      {},
      TWO_TAB_STATE
    );
    const tabOne = queryByText("tab one");
    expect(tabOne).toBeInTheDocument();
    // Simulate middle-click on tab
    fireEvent.mouseDown(tabOne as HTMLElement, { bubbles: true, button: 1 });
    await waitFor(() => expect(queryByText("tab one")).not.toBeInTheDocument());
  });
});
