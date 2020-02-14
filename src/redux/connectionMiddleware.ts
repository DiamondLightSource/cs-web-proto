import { Store } from "redux";
import log from "loglevel";
import { Connection, ConnectionState } from "../connection/plugin";
import {
  CONNECTION_CHANGED,
  SUBSCRIBE,
  WRITE_PV,
  VALUE_CHANGED,
  VALUES_CHANGED,
  UNSUBSCRIBE,
  Action
} from "./actions";
import { VType } from "../types/vtypes/vtypes";
import { PartialVType } from "../types/vtypes/merge";

function connectionChanged(
  store: Store,
  pvName: string,
  value: ConnectionState
): void {
  store.dispatch({
    type: CONNECTION_CHANGED,
    payload: { pvName: pvName, value: value }
  });
}

let queueStarted = false;
let globalStore: any = undefined;
const queue: Action[] = [];
function clearQueue(): void {
  log.info("Clearing queues");
  log.info(queue);
  if (globalStore) {
    globalStore.dispatch({ type: VALUES_CHANGED, payload: [...queue] });
    queue.length = 0;
  }
}
// Event loop
log.info(`outside event loop ${queueStarted}`);
if (!queueStarted) {
  log.info("Starting queue");
  setInterval(clearQueue, 100);
  queueStarted = true;
}

function valueChanged(
  store: Store,
  pvName: string,
  value: VType | PartialVType | undefined
): void {
  globalStore = store;
  queue.push({
    type: VALUE_CHANGED,
    payload: { pvName: pvName, value: value }
  });
}

/* Cheating with the types here. */
// eslint doesn't deal with currying very well:
// (x:any): any => (y:any): any => (z:any): any is perverse
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const connectionMiddleware = (connection: Connection) => (
  store: any
) => (next: any): any => (action: any): any => {
  if (!connection.isConnected()) {
    connection.connect(
      // Partial function application.
      connectionChanged.bind(null, store),
      valueChanged.bind(null, store)
    );
  }

  switch (action.type) {
    case SUBSCRIBE: {
      const { pvName } = action.payload;
      // Are we already subscribed?
      const effectivePvName = connection.subscribe(pvName);
      action = {
        ...action,
        payload: {
          ...action.payload,
          effectivePvName: effectivePvName,
          pvName: pvName
        }
      };
      break;
    }
    case WRITE_PV: {
      const { pvName, value } = action.payload;
      const effectivePvName =
        store.getState().effectivePvNameMap[pvName] || pvName;
      connection.putPv(effectivePvName, value);
      break;
    }
    case UNSUBSCRIBE: {
      const { componentId, pvName } = action.payload;
      const subs = store.getState().subscriptions;
      // Is this the last subscriber?
      // The reference will be removed in csReducer.
      const effectivePvName =
        store.getState().effectivePvNameMap[pvName] || pvName;

      if (
        subs[effectivePvName].length === 1 &&
        subs[effectivePvName][0] === componentId
      ) {
        connection.unsubscribe(pvName);
      }
    }
  }
  return next(action);
};
