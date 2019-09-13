import { Connection } from "../connection/plugin";
import {
  CONNECTION_CHANGED,
  SUBSCRIBE,
  WRITE_PV,
  VALUE_CHANGED,
  PV_RESOLVED
} from "./actions";
import { getStore } from "./store";
import { NType } from "../ntypes";
import { resolveMacros } from "../macros";

export interface ConnectionState {
  isConnected: boolean;
}

function connectionChanged(pvName: string, value: ConnectionState): void {
  getStore().dispatch({
    type: CONNECTION_CHANGED,
    payload: { pvName: pvName, value: value }
  });
}

function valueChanged(pvName: string, value: NType): void {
  getStore().dispatch({
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
    connection.connect(connectionChanged, valueChanged);
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
      connection.subscribe(resolvedPvName);
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
  }
  return next(action);
};
