import { Store } from "redux";
import { Connection, ConnectionState } from "../connection/plugin";
import {
  CONNECTION_CHANGED,
  SUBSCRIBE,
  WRITE_PV,
  VALUE_CHANGED,
  PV_RESOLVED,
  UNSUBSCRIBE
} from "./actions";
import { NType } from "../ntypes";
import { resolveMacros } from "../macros";

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

function valueChanged(store: Store, pvName: string, value: NType): void {
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
      const state = store.getState();
      let resolvedPvName;
      if (state.resolvedPvs.hasOwnProperty(pvName)) {
        resolvedPvName = state.resolvedPvs[pvName];
      } else {
        resolvedPvName = resolveMacros(pvName, state.macroMap);
        store.dispatch({
          type: PV_RESOLVED,
          payload: {
            unresolvedPvName: pvName,
            resolvedPvName: resolvedPvName
          }
        });
      }
      // Are we already subscribed?
      if (
        !state.subscriptions[pvName] ||
        state.subscriptions[pvName].length === 0
      ) {
        connection.subscribe(pvName);
      }
      break;
    }
    case WRITE_PV: {
      const { pvName, value } = action.payload;
      const state = store.getState();
      let resolvedPvName;
      if (state.resolvedPvs.hasOwnProperty(pvName)) {
        resolvedPvName = state.resolvedPvs[pvName];
      } else {
        resolvedPvName = resolveMacros(pvName, state.macroMap);
        store.dispatch({
          type: PV_RESOLVED,
          payload: {
            unresolvedPvName: pvName,
            resolvedPvName: resolvedPvName
          }
        });
      }
      connection.putPv(pvName, value);
      break;
    }
    case UNSUBSCRIBE: {
      const { componentId, pvName } = action.payload;
      const subs = store.getState().subscriptions;
      // Is this the last subscriber?
      // The reference will be removed in csReducer.
      if (subs[pvName].length === 1 && subs[pvName][0] === componentId) {
        connection.unsubscribe(pvName);
      }
    }
  }
  return next(action);
};
