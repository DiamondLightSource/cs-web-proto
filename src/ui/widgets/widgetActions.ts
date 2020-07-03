import { writePv } from "../hooks/useSubscription";
import { History } from "history";
import log from "loglevel";

import {
  putUrlInfoToHistory,
  updatePageDesciption,
  removePageDescription,
  getUrlInfoFromHistory,
  updateTabDesciption,
  removeTabDescription
} from "./urlControl";
import { MacroMap } from "../../types/macros";
import { DType } from "../../types/dtypes";
import { DynamicContent } from "./propTypes";

export const OPEN_PAGE = "OPEN_PAGE";
export const CLOSE_PAGE = "CLOSE_PAGE";
export const OPEN_TAB = "OPEN_TAB";
export const CLOSE_TAB = "CLOSE_TAB";
export const OPEN_WEBPAGE = "OPEN_WEBPAGE";
export const WRITE_PV = "WRITE_PV";

/* Giving info properties to each of the following works around a
   difficulty with TypeScript and PropTypes, where there's a problem
   when different actions have more than one property with the same
   name: https://stackoverflow.com/questions/59373461/proptypes-oneoftype-not-working-as-i-expect-with-typescript
*/

export interface OpenPage {
  type: typeof OPEN_PAGE;
  dynamicInfo: DynamicContent;
}

export interface ClosePage {
  type: typeof CLOSE_PAGE;
  dynamicInfo: DynamicContent;
}

export interface OpenTab {
  type: typeof OPEN_TAB;
  openTabInfo: DynamicContent;
}

export interface CloseTab {
  type: typeof CLOSE_TAB;
  closeTabInfo: DynamicContent;
}

export interface OpenWebpage {
  type: typeof OPEN_WEBPAGE;
  openWebpageInfo: {
    url: string;
    description?: string;
  };
}

export interface WritePv {
  type: typeof WRITE_PV;
  writePvInfo: {
    pvName: string;
    value: string | number;
    description?: string;
  };
}

export type WidgetAction =
  | OpenWebpage
  | WritePv
  | OpenPage
  | ClosePage
  | OpenTab
  | CloseTab;

export interface WidgetActions {
  actions: WidgetAction[];
  executeAsOne: boolean;
}

/* Special class to ensure that switches on WidgetAction type are complete. */
class InvalidAction extends Error {
  public constructor(val: never) {
    super(`Invalid action: ${val}`);
  }
}

export const getActionDescription = (action: WidgetAction): string => {
  switch (action.type) {
    case WRITE_PV:
      if (action.writePvInfo.description) {
        return action.writePvInfo.description;
      } else {
        return `Write ${action.writePvInfo.value} to ${action.writePvInfo.pvName}`;
      }
    case OPEN_WEBPAGE:
      if (action.openWebpageInfo.description) {
        return action.openWebpageInfo.description;
      } else {
        return `Open ${action.openWebpageInfo.url}`;
      }
    case OPEN_PAGE:
      console.log(action.dynamicInfo.description);
      if (action.dynamicInfo.description) {
        return action.dynamicInfo.description;
      } else {
        return `Open ${action.dynamicInfo.name}`;
      }
    case CLOSE_PAGE:
      if (action.dynamicInfo.description) {
        return action.dynamicInfo.description;
      } else {
        return `Open ${action.dynamicInfo.name}`;
      }
    case OPEN_TAB:
      if (action.openTabInfo.description) {
        return action.openTabInfo.description;
      } else {
        return `Open tab ${action.openTabInfo.name}`;
      }
    case CLOSE_TAB:
      if (action.closeTabInfo.description) {
        return action.closeTabInfo.description;
      } else {
        return `Close tab ${action.closeTabInfo.name}`;
      }
    default:
      throw new InvalidAction(action);
  }
};

export const openPage = (
  action: OpenPage,
  history: History,
  parentMacros?: MacroMap
): void => {
  //Find current browser path: currentPath
  const currentUrlInfo = getUrlInfoFromHistory(history);
  const { location, file } = action.dynamicInfo;
  file.macros = {
    ...(parentMacros ?? {}),
    ...file.macros
  };
  const newUrlInfo = updatePageDesciption(currentUrlInfo, location, file);
  putUrlInfoToHistory(history, newUrlInfo);
};

export const closePage = (action: ClosePage, history: History): void => {
  const currentUrlInfo = getUrlInfoFromHistory(history);
  const { location } = action.dynamicInfo;
  const newUrlInfo = removePageDescription(currentUrlInfo, location);
  putUrlInfoToHistory(history, newUrlInfo);
};

export const openTab = (
  action: OpenTab,
  history: History,
  parentMacros?: MacroMap
): void => {
  //Find current browser path: currentPath
  const currentUrlInfo = getUrlInfoFromHistory(history);
  const { name, location, file } = action.openTabInfo;
  file.macros = {
    ...(parentMacros ?? {}),
    ...file.macros
  };
  const newUrlInfo = updateTabDesciption(currentUrlInfo, location, name, file);
  putUrlInfoToHistory(history, newUrlInfo);
};

export const closeTab = (action: CloseTab, history: History): void => {
  const currentUrlInfo = getUrlInfoFromHistory(history);
  const { name, location } = action.closeTabInfo;
  const newUrlInfo = removeTabDescription(currentUrlInfo, location, name);
  putUrlInfoToHistory(history, newUrlInfo);
};

export const executeAction = (
  action: WidgetAction,
  history?: History,
  parentMacros?: MacroMap
): void => {
  switch (action.type) {
    case OPEN_PAGE:
      if (history) {
        openPage(action, history, parentMacros);
      } else {
        log.error("Tried to open a page but no history object passed");
      }
      break;
    case CLOSE_PAGE:
      if (history) {
        closePage(action, history);
      } else {
        log.error("Tried to open a page but no history object passed");
      }
      break;
    case OPEN_TAB:
      if (history) {
        openTab(action, history, parentMacros);
      } else {
        log.error("Tried to open a page but no history object passed");
      }
      break;
    case CLOSE_TAB:
      if (history) {
        closeTab(action, history);
      } else {
        log.error("Tried to open a page but no history object passed");
      }
      break;
    case OPEN_WEBPAGE:
      window.open(action.openWebpageInfo.url);
      break;
    case WRITE_PV:
      let dtypeVal;
      if (typeof action.writePvInfo.value === "number") {
        dtypeVal = new DType({ doubleValue: action.writePvInfo.value });
      } else {
        dtypeVal = new DType({ stringValue: action.writePvInfo.value });
      }
      writePv(action.writePvInfo.pvName, dtypeVal);
      break;
    default:
      throw new InvalidAction(action);
  }
};

export const executeActions = (
  actions: WidgetActions,
  history?: History,
  parentMacros?: MacroMap
): void => {
  if (actions.actions.length > 0) {
    let toExecute: WidgetAction[] = [];
    if (actions.executeAsOne) {
      toExecute = actions.actions;
    } else {
      toExecute = [actions.actions[0]];
    }
    for (const action of toExecute) {
      log.debug(`executing an action: ${getActionDescription(action)}`);
      executeAction(action, history, parentMacros);
    }
  }
};
