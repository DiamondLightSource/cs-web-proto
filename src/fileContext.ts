import React from "react";
import { MacroMap, macrosEqual } from "./types/macros";

export interface FileDescription {
  // All information required for an embedded display
  path: string; // Name or file of path (without suffix ?)
  type: "json" | "opi" | "bob"; // File type - which parser and suffix
  macros: MacroMap; // Macros
  defaultProtocol: string; // Default PV prefix for parser
}

/**
 * Compare each property on two FileDescription objects
 * @param first first object to compare to second
 * @param second second object to compare to first
 * @returns boolean, true if all properties match else false
 */
export function fileDescEqual(
  first: FileDescription,
  second: FileDescription
): boolean {
  if (first === undefined || second === undefined) {
    return false;
  }
  const val =
    first.path === second.path &&
    first.type === second.type &&
    first.defaultProtocol === second.defaultProtocol &&
    macrosEqual(first.macros, second.macros);
  return val;
}

export interface PageState {
  [location: string]: FileDescription;
}

export interface TabState {
  [location: string]: {
    fileDetails: [string, FileDescription][];
    selectedTab: string;
  };
}

export function addPage(
  pageState: PageState,
  location: string,
  desc: FileDescription
): PageState {
  const pagesCopy = { ...pageState };
  pagesCopy[location] = desc;
  return pagesCopy;
}

export function removePage(
  pageState: PageState,
  location: string,
  desc?: FileDescription
): PageState {
  // If desc not provided, close the page anyway.
  // If desc is provided, close the page only if desc
  // matches the loaded page.
  const pagesCopy = { ...pageState };
  if (!desc || fileDescEqual(desc, pagesCopy[location])) {
    delete pagesCopy[location];
  }
  return pagesCopy;
}

export function addTab(
  tabState: TabState,
  location: string,
  tabName: string,
  desc: FileDescription
): TabState {
  const tabsCopy = { ...tabState };
  const locationTabs = tabsCopy[location] ?? {
    fileDetails: [],
    selectedTab: ""
  };
  let matched = false;
  for (const [tabName1, desc1] of locationTabs.fileDetails) {
    if (fileDescEqual(desc, desc1) && tabName === tabName1) {
      matched = true;
      locationTabs.selectedTab = tabName;
    }
  }
  if (!matched) {
    locationTabs.fileDetails.push([tabName, desc]);
    locationTabs.selectedTab = tabName;
  }
  const newTabState = {
    ...tabsCopy,
    [location]: locationTabs
  };
  return newTabState;
}

export function removeTab(
  tabState: TabState,
  location: string,
  desc: FileDescription
): TabState {
  const tabsCopy = { ...tabState };
  const locationTabs = tabsCopy[location] ?? {
    fileDetails: [],
    selectedTab: ""
  };
  let selectedTabRemoved = false;
  let selectedTab = locationTabs.selectedTab;
  const filteredFileDetails = locationTabs.fileDetails.filter(
    ([tabName1, desc1]) => {
      if (fileDescEqual(desc, desc1)) {
        if (tabName1 === locationTabs.selectedTab) {
          selectedTabRemoved = true;
        }
        return false;
      }
      return true;
    }
  );
  if (selectedTabRemoved) {
    selectedTab = filteredFileDetails[filteredFileDetails.length - 1][0];
  }
  const newTabState = {
    ...tabsCopy,
    [location]: {
      fileDetails: filteredFileDetails,
      selectedTab
    }
  };
  return newTabState;
}

export function selectTab(
  tabState: TabState,
  location: string,
  tabName: string
): TabState {
  const tabsCopy = { ...tabState };
  const locationTabs = tabsCopy[location] ?? {
    fileDetails: [],
    selectedTab: ""
  };
  return {
    ...tabsCopy,
    [location]: {
      ...locationTabs,
      selectedTab: tabName
    }
  };
}

export type FileContextType = {
  pageState: PageState;
  tabState: TabState;
  addPage: (location: string, fileDesc: FileDescription) => void;
  removePage: (location: string, fileDesc?: FileDescription) => void;
  addTab: (
    location: string,
    tabName: string,
    fileDesc: FileDescription
  ) => void;
  removeTab: (location: string, fileDesc: FileDescription) => void;
  selectTab: (location: string, tabName: string) => void;
};

// React.useContext(FileContext) gives access to each of the
// properties in initialState
const initialState: FileContextType = {
  pageState: {},
  tabState: {},
  addPage: () => {},
  removePage: () => {},
  addTab: () => {},
  removeTab: () => {},
  selectTab: () => {}
};

/**
 * Helper function to create a file context given the appropriate state.
 * @param pageState PageState for app
 * @param setPageState function for setting pageState
 * @param tabState TabState for app
 * @param setTabState function for setting tabState
 */
export function createFileContext(
  pageState: PageState,
  setPageState: React.Dispatch<React.SetStateAction<PageState>>,
  tabState: TabState,
  setTabState: React.Dispatch<React.SetStateAction<TabState>>
): FileContextType {
  return {
    pageState,
    tabState,
    addPage: (location: string, fileDesc: FileDescription) => {
      setPageState(addPage(pageState, location, fileDesc));
    },
    removePage: (location: string, fileDesc?: FileDescription) => {
      setPageState(removePage(pageState, location, fileDesc));
    },
    addTab: (location: string, tabName: string, fileDesc: FileDescription) => {
      setTabState(addTab(tabState, location, tabName, fileDesc));
    },
    removeTab: (location: string, fileDesc: FileDescription) => {
      setTabState(removeTab(tabState, location, fileDesc));
    },
    selectTab: (location: string, tabName: string) => {
      setTabState(selectTab(tabState, location, tabName));
    }
  };
}
export const FileContext = React.createContext(initialState);
