import { MiddlewareAPI, Dispatch } from "redux";
import { Connection, ConnectionState } from "../connection/plugin";
import {
  CONNECTION_CHANGED,
  SUBSCRIBE,
  SUBSCRIBE_DEVICE,
  WRITE_PV,
  VALUE_CHANGED,
  UNSUBSCRIBE,
  Action
} from "./actions";
import { DType } from "../types/dtypes";

function connectionChanged(
  store: MiddlewareAPI,
  pvName: string,
  value: ConnectionState
): void {
  store.dispatch({
    type: CONNECTION_CHANGED,
    payload: { pvName: pvName, value: value }
  });
}

function valueChanged(
  store: MiddlewareAPI,
  pvName: string,
  value: DType
): void {
  store.dispatch({
    type: VALUE_CHANGED,
    payload: { pvName: pvName, value: value }
  });
}

function deviceQueryChanged(
  store: MiddlewareAPI,
  deviceName: string,
  value: string
): void {
  store.dispatch({
    type: SUBSCRIBE_DEVICE,
    payload: { deviceName: deviceName, value: value }
  });
}

export const connectionMiddleware = (connection: Connection) => (
  store: MiddlewareAPI
) => (next: Dispatch<Action>): any => (action: Action): Action => {
  if (!connection.isConnected()) {
    connection.connect(
      // Partial function application.
      (pvName: string, value: ConnectionState): void =>
        connectionChanged(store, pvName, value),
      (pvName: string, value: DType): void => valueChanged(store, pvName, value),
      (deviceName: string, value: string): void => deviceQueryChanged(store, deviceName, value)
    );
  }
  console.log("action", action.type);
  switch (action.type) {
    case SUBSCRIBE: {
      const { pvName, type } = action.payload;
      // Are we already subscribed?
      const effectivePvName = connection.subscribe(pvName, type);
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
    case SUBSCRIBE_DEVICE: {
      let { deviceName, description } = action.payload;
      // Are we already subscribed?
      description = connection.subscribe_device(deviceName);
      action = {
        ...action,
        payload: {
          ...action.payload,
          deviceName: deviceName,
          description: description
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
