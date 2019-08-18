import { ConnectionPlugin } from "../connection/plugin";
import { ConiqlPlugin } from "../connection/coniql";
import { SUBSCRIBE, WRITE_PV, PV_CHANGED } from "./actions";
import { getStore } from "./store";
import { NType } from "../cs";

let connection: ConnectionPlugin | null = null;

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
export const connectionMiddleware = (store: any) => (next: any) => (
  action: any
): any => {
  switch (action.type) {
    case SUBSCRIBE: {
      if (connection === null) {
        connection = new ConiqlPlugin(action.payload.url, pvChanged);
      }
      connection.subscribe(action.payload.pvName);
      break;
    }
    case WRITE_PV: {
      if (connection === null) {
        connection = new ConiqlPlugin(action.payload.url, pvChanged);
      }
      connection.putPv(action.payload.pvName, action.payload.value);
      break;
    }
  }
  return next(action);
};
