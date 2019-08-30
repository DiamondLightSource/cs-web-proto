import { Connection, ConnectionState } from "../connection/plugin";
import {
  CONNECTION_CHANGED,
  SUBSCRIBE,
  WRITE_PV,
  VALUE_CHANGED
} from "./actions";
import { getStore } from "./store";
import { NType } from "../ntypes";

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
      connection.subscribe(action.payload.pvName);
      break;
    }
    case WRITE_PV: {
      connection.putPv(action.payload.pvName, action.payload.value);
      break;
    }
  }
  return next(action);
};
