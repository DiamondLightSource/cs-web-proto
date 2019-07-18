import { SimulatorPlugin } from "../connection/plugin";
import { SUBSCRIBE, WRITE_PV, PV_CHANGED } from "./actions";
import { store } from "./store";

let connection: SimulatorPlugin | null = null;

function pvChanged(pvName: string, value: any): void {
  store.dispatch({
    type: PV_CHANGED,
    payload: { pvName: pvName, value: value }
  });
}

/* Cheating with the types here. */
export const connectionMiddleware = (store: any) => (next: any) => (
  action: any
) => {
  switch (action.type) {
    case SUBSCRIBE: {
      if (connection === null) {
        connection = new SimulatorPlugin(action.payload.url, pvChanged);
      }
      connection.subscribe(action.payload.pvName);
      break;
    }
    case WRITE_PV: {
      if (connection === null) {
        connection = new SimulatorPlugin(action.payload.url, pvChanged);
      }
      connection.putPv(action.payload.pvName, action.payload.value);
      break;
    }
  }
  return next(action);
};
