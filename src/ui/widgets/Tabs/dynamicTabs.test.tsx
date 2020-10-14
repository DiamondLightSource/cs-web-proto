import React from "react";
import log from "loglevel";
import { FileDescription, TabState } from "../../../fileContext";
import { contextRender } from "../../../setupTests";
import { DynamicTabsComponent } from "./dynamicTabs";

// Import Display widget to ensure it is registered.
import { Display } from "..";
log.debug(Display.name);

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
        selectedTab: "tab one"
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
