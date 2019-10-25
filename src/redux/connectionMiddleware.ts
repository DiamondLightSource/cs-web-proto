import { Store } from "redux";
import { Connection, ConnectionState } from "../connection/plugin";
import {
  CONNECTION_CHANGED,
  SUBSCRIBE,
  WRITE_PV,
  VALUE_CHANGED,
  UNSUBSCRIBE
} from "./actions";

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

function valueChanged(
  store: Store,
  pvName: string,
  value: object | undefined
): void {
  store.dispatch({
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
      const newPvName = connection.subscribe(pvName);
      action = {
        ...action,
        payload: {
          ...action.payload,
          shortPvName: newPvName,
          pvName: pvName
        }
      };
      break;
    }
    case WRITE_PV: {
      const { pvName, value } = action.payload;
      const shortPvName = store.getState().shortPvNameMap[pvName] || pvName;
      connection.putPv(shortPvName, value);
      break;
    }
    case UNSUBSCRIBE: {
      const { componentId, pvName } = action.payload;
      const subs = store.getState().subscriptions;
      // Is this the last subscriber?
      // The reference will be removed in csReducer.
      const shortPvName = store.getState().shortPvNameMap[pvName] || pvName;

      if (
        subs[shortPvName].length === 1 &&
        subs[shortPvName][0] === componentId
      ) {
        connection.unsubscribe(pvName);
      }
    }
  }
  return next(action);
};
