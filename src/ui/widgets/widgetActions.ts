import { writePv } from "../hooks/useSubscription";
import log from "loglevel";

import { MacroMap } from "../../types/macros";
import { DType } from "../../types/dtypes";
import { DynamicContent } from "./propTypes";
import { FileContextType } from "../../fileContext";

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

// Still restricts action types for typescript and easy to add more
export interface DynamicAction {
  type:
    | typeof OPEN_PAGE
    | typeof CLOSE_PAGE
    | typeof OPEN_TAB
    | typeof CLOSE_TAB;
  dynamicInfo: DynamicContent;
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

export type WidgetAction = OpenWebpage | WritePv | DynamicAction;

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
      if (action.dynamicInfo.description) {
        return action.dynamicInfo.description;
      } else {
        return `Open page ${action.dynamicInfo.name}`;
      }
    case CLOSE_PAGE:
      if (action.dynamicInfo.description) {
        return action.dynamicInfo.description;
      } else {
        return `Close page ${action.dynamicInfo.name}`;
      }
    case OPEN_TAB:
      if (action.dynamicInfo.description) {
        return action.dynamicInfo.description;
      } else {
        return `Open tab ${action.dynamicInfo.name}`;
      }
    case CLOSE_TAB:
      if (action.dynamicInfo.description) {
        return action.dynamicInfo.description;
      } else {
        return `Close tab ${action.dynamicInfo.name}`;
      }
    default:
      throw new InvalidAction(action);
  }
};

export const openPage = (
  action: DynamicAction,
  fileContext?: FileContextType,
  parentMacros?: MacroMap
): void => {
  const { location, file } = action.dynamicInfo;
  file.macros = {
    ...(parentMacros ?? {}),
    ...file.macros
  };
  fileContext?.addPage(location, file);
};

export const closePage = (
  action: DynamicAction,
  fileContext?: FileContextType
): void => {
  const { location, file } = action.dynamicInfo;
  fileContext?.removePage(location, file);
};

export const openTab = (
  action: DynamicAction,
  fileContext?: FileContextType,
  parentMacros?: MacroMap
): void => {
  const { name, location, file } = action.dynamicInfo;
  file.macros = {
    ...(parentMacros ?? {}),
    ...file.macros
  };
  fileContext?.addTab(location, name, file);
};

export const closeTab = (
  action: DynamicAction,
  fileContext: FileContextType
): void => {
  const { name, location, file } = action.dynamicInfo;
  fileContext.removeTab(location, name, file);
};

export const executeAction = (
  action: WidgetAction,
  files?: FileContextType,
  parentMacros?: MacroMap
): void => {
  switch (action.type) {
    case OPEN_PAGE:
      if (files) {
        openPage(action, files, parentMacros);
      } else {
        log.error("Tried to open a page but no file context passed");
      }
      break;
    case CLOSE_PAGE:
      if (files) {
        closePage(action, files);
      } else {
        log.error("Tried to open a page but no file context passed");
      }
      break;
    case OPEN_TAB:
      if (files) {
        openTab(action, files, parentMacros);
      } else {
        log.error("Tried to open a page but no file context passed");
      }
      break;
    case CLOSE_TAB:
      if (files) {
        closeTab(action, files);
      } else {
        log.error("Tried to open a page but no file context passed");
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
  files?: FileContextType,
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
      log.info(`Executing an action: ${getActionDescription(action)}`);
      executeAction(action, files, parentMacros);
    }
  }
};
