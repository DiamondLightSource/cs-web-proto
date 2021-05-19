import log from "loglevel";
import { MiddlewareAPI, Dispatch } from "redux";
import { Connection, ConnectionState } from "../connection/plugin";
import {
  CONNECTION_CHANGED,
  SUBSCRIBE,
  WRITE_PV,
  VALUE_CHANGED,
  QUERY_DEVICE,
  UNSUBSCRIBE,
  Action,
  DEVICE_QUERIED
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

function deviceQueried(
  store: MiddlewareAPI,
  device: string,
  value: DType
): void {
  store.dispatch({
    type: DEVICE_QUERIED,
    payload: { device, value }
  });
}

export const connectionMiddleware =
  (connection: Connection) =>
  (store: MiddlewareAPI) =>
  (next: Dispatch<Action>): any =>
  (action: Action): Action => {
    if (!connection.isConnected()) {
      connection.connect(
        // Partial function application.
        (pvName: string, value: ConnectionState): void =>
          connectionChanged(store, pvName, value),
        (pvName: string, value: DType): void =>
          valueChanged(store, pvName, value),
        (device: string, value: DType): void =>
          deviceQueried(store, device, value)
      );
    }

    switch (action.type) {
      case SUBSCRIBE: {
        const { pvName, type } = action.payload;
        // Are we already subscribed?
        let effectivePvName = pvName;
        try {
          effectivePvName = connection.subscribe(pvName, type);
        } catch (error) {
          log.error(`Failed to subscribe to pv ${pvName}`);
          log.error(error);
        }
        // Even if there is a problem subscribing, the action is passed
        // on so that there is a record of this subscription. This
        // allows the unsubscription mechanism still to work.
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
      case WRITE_PV: {
        const { pvName, value } = action.payload;
        const effectivePvName =
          store.getState().effectivePvNameMap[pvName] || pvName;
        try {
          connection.putPv(effectivePvName, value);
        } catch (error) {
          log.error(`Failed to put to pv ${pvName}`);
          log.error(error);
        }
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
          try {
            connection.unsubscribe(pvName);
          } catch (error) {
            log.error(`Failed to unsubscribe from pv ${pvName}`);
            log.error(error);
          }
        }
        break;
      }
      case QUERY_DEVICE: {
        const { device } = action.payload;
        try {
          // Devices should be queried once and then stored
          if (!store.getState().deviceCache[device]) {
            connection.getDevice(device);
          }
        } catch (error) {
          log.error(`Failed to query device ${device}`);
          log.error(error);
        }
        break;
      }
    }
    return next(action);
  };
