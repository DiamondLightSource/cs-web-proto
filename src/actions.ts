import { writePv } from "./hooks/useSubscription";
import { valueToVtype } from "./vtypes/utils";
import { History } from "history";
import log from "loglevel";

export const OPEN_PAGE = "OPEN_PAGE";
export const OPEN_WEBPAGE = "OPEN_WEBPAGE";
export const WRITE_PV = "WRITE_PV";

export interface OpenPage {
  type: typeof OPEN_PAGE;
  page: string;
  location: string;
  macros: string;
}

export interface OpenWebpage {
  type: typeof OPEN_WEBPAGE;
  url: string;
  description: string;
}

export interface WritePv {
  type: typeof WRITE_PV;
  pvName: string;
  value: string | number;
}

export type ACTION_TYPE = OpenPage | OpenWebpage | WritePv;

export interface Actions {
  actions: ACTION_TYPE[];
  executeAsOne: boolean;
}

export const executeActions = (actions: Actions, history?: History): void => {
  log.debug(`executing an action ${actions.actions[0].type}`);
  let toExecute: ACTION_TYPE[] = [];
  if (actions.executeAsOne) {
    toExecute = actions.actions;
  } else {
    toExecute = [actions.actions[0]];
  }
  for (const action of toExecute) {
    switch (action.type) {
      case OPEN_PAGE:
        if (history) {
          let currentPath = "";
          if (history.location.pathname !== undefined)
            currentPath = history.location.pathname;

          let newPathComponent =
            action.location + "/" + action.page + "/" + action.macros + "/";
          let matcher = new RegExp(action.location + "/.+/.+");
          let groups = matcher.exec(currentPath);
          if (groups !== null && groups[0] !== undefined) {
            currentPath = currentPath.replace(groups[0], newPathComponent);
          } else {
            currentPath = currentPath + newPathComponent;
          }
          history.push(currentPath);
        } else {
          log.error("Tried to open a page but no history object passed");
        }
        break;
      case OPEN_WEBPAGE:
        window.open(action.url);
        break;
      case WRITE_PV:
        writePv(action.pvName, valueToVtype(action.value));
        break;
      default:
        log.warn(`unexpected action type`);
    }
  }
};
