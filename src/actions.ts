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

export type ACTION_TYPE = OpenWebpage | WritePv;

export interface Actions {
  actions: ACTION_TYPE[];
  executeAsOne: boolean;
}

export const executeAction = (action: ACTION_TYPE): void => {
  switch (action.type) {
    case OPEN_WEBPAGE:
      window.open(action.url);
      break;
    case WRITE_PV:
      writePv(action.pvName, valueToVtype(action.value));
      break;
    default:
      log.warn(`unexpected action type`);
  }
};

export const executeActions = (actions: Actions): void => {
  log.debug(`executing an action ${actions.actions[0].type}`);
  let toExecute: ACTION_TYPE[] = [];
  if (actions.executeAsOne) {
    toExecute = actions.actions;
  } else {
    toExecute = [actions.actions[0]];
  }
  for (const action of toExecute) {
    executeAction(action);
  }
};
