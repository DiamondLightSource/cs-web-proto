import { SimulatorPlugin } from "../connection/sim";
import { SUBSCRIBE, WRITE_PV, PV_CHANGED } from "./actions";
import { store } from "./store";
import { ConiqlPlugin } from "../connection/coniql";
import { NType } from "../cs";

let connection: SimulatorPlugin | ConiqlPlugin | null = null;

function pvChanged(pvName: string, value: NType): void {
  store.dispatch({
    type: PV_CHANGED,
    payload: { pvName: pvName, value: value.subscribeFloatScalar.value }
  });
}

/* Cheating with the types here. */
export const connectionMiddleware = (store: any) => (next: any) => (
  action: any
) => {
  switch (action.type) {
    case SUBSCRIBE: {
      if (connection === null) {
        connection = new ConiqlPlugin(action.payload.url, pvChanged);
      }
      connection.subscribe1(action.payload.pvName);
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
