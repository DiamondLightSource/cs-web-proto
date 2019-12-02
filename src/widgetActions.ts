import { writePv } from "./hooks/useSubscription";
import { valueToVtype } from "./vtypes/utils";
import log from "loglevel";

export const OPEN_WEBPAGE = "OPEN_WEBPAGE";
export const WRITE_PV = "WRITE_PV";

export interface OpenWebpage {
  type: typeof OPEN_WEBPAGE;
  url: string;
  description: string;
}

export interface WritePv {
  type: typeof WRITE_PV;
  pvName: string;
  value: string | number;
  description: string;
}

export type WidgetAction = OpenWebpage | WritePv;

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
  if (action.description) {
    return action.description;
  } else {
    switch (action.type) {
      case WRITE_PV:
        return `Write ${action.value} to ${action.pvName}`;
      case OPEN_WEBPAGE:
        return `Open ${action.url}`;
      default:
        throw new InvalidAction(action);
    }
  }
};

export const executeAction = (action: WidgetAction): void => {
  switch (action.type) {
    case OPEN_WEBPAGE:
      window.open(action.url);
      break;
    case WRITE_PV:
      writePv(action.pvName, valueToVtype(action.value));
      break;
    default:
      throw new InvalidAction(action);
  }
};

export const executeActions = (actions: WidgetActions): void => {
  if (actions.actions.length > 0) {
    let toExecute: WidgetAction[] = [];
    if (actions.executeAsOne) {
      toExecute = actions.actions;
    } else {
      toExecute = [actions.actions[0]];
    }
    for (const action of toExecute) {
      log.debug(`executing an action ${action.type}`);
      executeAction(action);
    }
  }
};
