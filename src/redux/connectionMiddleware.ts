import { Connection } from "../connection/plugin";
import { SUBSCRIBE, WRITE_PV, PV_CHANGED } from "./actions";
import { getStore } from "./store";
import { NType } from "../cs";

function pvChanged(pvName: string, value: NType): void {
  getStore().dispatch({
    type: PV_CHANGED,
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
    connection.connect(pvChanged);
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
