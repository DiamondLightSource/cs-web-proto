import { writePv } from "./hooks/useSubscription";
import { valueToVtype } from "./vtypes/utils";
import { History } from "history";
import log from "loglevel";

export const OPEN_PAGE = "OPEN_PAGE";
export const CLOSE_PAGE = "CLOSE_PAGE";
export const OPEN_WEBPAGE = "OPEN_WEBPAGE";
export const WRITE_PV = "WRITE_PV";

/* Giving info properties to each of the following works around a
   difficulty with TypeScript and PropTypes, where there's a problem
   when different actions have more than one property with the same
   name: https://stackoverflow.com/questions/59373461/proptypes-oneoftype-not-working-as-i-expect-with-typescript
*/

export interface OpenPage {
  type: typeof OPEN_PAGE;
  openPageInfo: {
    page: string;
    location: string;
    macros: string;
    description: string;
  };
}

export interface ClosePage {
  type: typeof CLOSE_PAGE;
  closePageInfo: {
    location: string;
    description: string;
  };
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

export type WidgetAction = OpenWebpage | WritePv | OpenPage | ClosePage;

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
      if (action.openPageInfo.description) {
        return action.openPageInfo.description;
      } else {
        return `Open ${action.openPageInfo.page}`;
      }
    case CLOSE_PAGE:
      if (action.closePageInfo.description) {
        return action.closePageInfo.description;
      } else {
        return `Open ${action.closePageInfo.location}`;
      }
    default:
      throw new InvalidAction(action);
  }
};

export const openPage = (action: OpenPage, history: History): void => {
  //Find current browser path: currentPath
  let currentPath = "";
  if (history.location.pathname !== undefined)
    currentPath = history.location.pathname;
  const { location, page, macros } = action.openPageInfo;

  //New page component in action.location
  const newPathComponent = location + "/" + page + "/" + macros + "/";

  //Find existing component in same location
  const matcher = new RegExp(location + "/[^/]*/[^/]*/");
  const groups = matcher.exec(currentPath);
  if (groups !== null && groups[0] !== undefined) {
    //Swap component in location
    currentPath = currentPath.replace(groups[0], newPathComponent);
  } else {
    //Append component in location
    currentPath = currentPath + newPathComponent;
  }
  history.push(currentPath);
};

export const closePage = (action: ClosePage, history: History): void => {
  const { location } = action.closePageInfo;
  //Find current browser path: currentPath
  let currentPath = "";
  if (history.location.pathname !== undefined)
    currentPath = history.location.pathname;

  //Find any existing component in action location
  const matcher = new RegExp(location + "/[^/]*/[^/]*/");
  const groups = matcher.exec(currentPath);
  if (groups !== null && groups[0] !== undefined) {
    //Remove component in location
    currentPath = currentPath.replace(groups[0], "");
  }
  history.push(currentPath);
};

export const executeAction = (
  action: WidgetAction,
  history?: History
): void => {
  switch (action.type) {
    case OPEN_PAGE:
      if (history) {
        openPage(action, history);
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
    case OPEN_WEBPAGE:
      window.open(action.openWebpageInfo.url);
      break;
    case WRITE_PV:
      writePv(
        action.writePvInfo.pvName,
        valueToVtype(action.writePvInfo.value)
      );
      break;
    default:
      throw new InvalidAction(action);
  }
};

export const executeActions = (
  actions: WidgetActions,
  history?: History
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
      executeAction(action, history);
    }
  }
};
