/**
 * Store information about open pages (used in the dynamic page widget)
 * and tabs (used in the dynamic tabs widget).
 * The information is stored in a history object, which allows you
 * to navigate back and forward through these operations even though
 * the URL doesn't change.
 * It is provided to widgets using a React context.
 */
import React from "react";
import log from "loglevel";
import { useHistory, useLocation } from "react-router-dom";
import { MacroMap, macrosEqual } from "./types/macros";

export interface FileDescription {
  // All information required for an embedded display
  path: string; // Name or file of path (without suffix ?)
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
    // -1 may be used if no files are open.
    selectedTab: number;
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
    selectedTab: -1
  };
  let matched = false;
  let index = 0;
  for (const [tabName1, desc1] of locationTabs.fileDetails) {
    if (fileDescEqual(desc, desc1) && tabName === tabName1) {
      matched = true;
      locationTabs.selectedTab = index;
    }
    index += 1;
  }
  if (!matched) {
    locationTabs.fileDetails.push([tabName, desc]);
    locationTabs.selectedTab = locationTabs.fileDetails.length - 1;
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
  tabName: string,
  fileDesc: FileDescription
): TabState {
  const tabsCopy = { ...tabState };
  const locationTabs = tabsCopy[location] ?? {
    fileDetails: [],
    selectedTab: -1
  };
  let selectedTab = locationTabs.selectedTab;
  const filteredFileDetails = locationTabs.fileDetails.filter(
    ([tabName1, fileDesc1], index) => {
      if (tabName1 === tabName && fileDescEqual(fileDesc1, fileDesc)) {
        // If a tab to the left of the selected tab is closed,
        // or the selected tab is closed, the selected tab moves
        // one to the left.
        if (index <= locationTabs.selectedTab) {
          selectedTab = selectedTab - 1;
        }
        return false;
      }
      return true;
    }
  );
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
  index: number
): TabState {
  const tabsCopy = { ...tabState };
  const locationTabs = tabsCopy[location] ?? {
    fileDetails: [],
    selectedTab: -1
  };
  return {
    ...tabsCopy,
    [location]: {
      ...locationTabs,
      selectedTab: index
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
  removeTab: (
    location: string,
    tabName: string,
    fileDesc: FileDescription
  ) => void;
  selectTab: (location: string, index: number) => void;
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

/* Page that will be loaded at start. */
const INITIAL_PAGE_STATE: PageState = {
  app: {
    path: "json/home.json",
    macros: {},
    defaultProtocol: "pva"
  }
};
interface FileHistory {
  pageState: PageState;
  tabState: TabState;
}

export const FileContext = React.createContext(initialState);
interface FileProviderProps {
  initialPageState?: PageState;
  initialTabState?: TabState;
  children: JSX.Element;
}

export const FileProvider: React.FC<FileProviderProps> = (
  props: FileProviderProps
): JSX.Element => {
  const initialPageState = props.initialPageState ?? INITIAL_PAGE_STATE;
  const initialTabState = props.initialTabState ?? {};
  // Set up the file context, which contains information about
  // the open pages in DynamicPages and tabs in DynamicTabs.
  const history = useHistory<FileHistory>();
  // Note: when pushing to the history, make sure to use the
  // latest version of the state i.e. history.location.state.
  // Previously I used the version retrieved here and this
  // could overwrite the history with older versions
  const historyLocation = useLocation<FileHistory>();
  const { pageState, tabState } = historyLocation.state ?? {
    pageState: initialPageState,
    tabState: initialTabState
  };
  const fileContext = {
    pageState,
    tabState,
    addPage: (location: string, fileDesc: FileDescription): void => {
      const newPageState = addPage(pageState, location, fileDesc);
      history.push(history.location.pathname, {
        pageState: newPageState,
        tabState: history.location.state?.tabState ?? tabState
      });
    },
    removePage: (location: string, fileDesc?: FileDescription): void => {
      const newPageState = removePage(pageState, location, fileDesc);
      history.push(history.location.pathname, {
        pageState: newPageState,
        tabState: history.location.state?.tabState ?? tabState
      });
    },
    addTab: (
      location: string,
      tabName: string,
      fileDesc: FileDescription
    ): void => {
      const newTabState = addTab(tabState, location, tabName, fileDesc);
      history.push(history.location.pathname, {
        pageState: history.location.state?.pageState ?? pageState,
        tabState: newTabState
      });
    },
    removeTab: (
      location: string,
      tabName: string,
      fileDesc: FileDescription
    ): void => {
      const newTabState = removeTab(tabState, location, tabName, fileDesc);
      history.push(history.location.pathname, {
        pageState: history.location.state?.pageState ?? pageState,
        tabState: newTabState
      });
    },
    selectTab: (location: string, index: number): void => {
      const newTabState = selectTab(tabState, location, index);
      history.push(history.location.pathname, {
        pageState: history.location.state?.pageState ?? pageState,
        tabState: newTabState
      });
    }
  };
  return (
    <FileContext.Provider value={fileContext}>
      {props.children}
    </FileContext.Provider>
  );
};

// Special context for exit buttons.
// A widget can register itself as handling exit actions and provide
// the function to do so via this context.
export type ExitContextType = () => void;
export const ExitFileContext = React.createContext(() => {
  log.warn("Exit action has no consumer.");
});
