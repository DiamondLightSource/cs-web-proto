import { SimulatorPlugin } from "../connection/plugin";
import { SUBSCRIBE, WRITE_PV } from "./actions";
import { store } from "./store";

let connection: SimulatorPlugin | null = null;

function writePv(pvName: string, value: any): void {
  store.dispatch({ type: WRITE_PV, payload: { pvName: pvName, value: value } });
}

/* Cheating with the types here. */
export const connectionMiddleware = (store: any) => (next: any) => (
  action: any
) => {
  switch (action.type) {
    case SUBSCRIBE: {
      if (connection === null) {
        connection = new SimulatorPlugin(action.payload.url, writePv);
      }
      connection.subscribe(action.payload.pvName);
    }
  }

  switch (action.type) {
    case WRITE_PV: {
      if (connection === null) {
        connection = new SimulatorPlugin(action.payload.url, writePv);
      }
      connection.putPv(action.payload.pvName, action.payload.value);
    }
  }
  return next(action);
};
