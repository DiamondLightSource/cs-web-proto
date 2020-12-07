import { DType } from "../types/dtypes";
import { ConnectionState, SubscriptionType } from "../connection/plugin";

export const CONNECTION_CHANGED = "connection_changed";
export const SUBSCRIBE = "subscribe";
export const UNSUBSCRIBE = "unsubscribe";
export const VALUE_CHANGED = "value_changed";
export const VALUES_CHANGED = "values_changed";
export const WRITE_PV = "write_pv";
export const DEVICE_QUERIED = "device_queried";
export const QUERY_DEVICE = "query_device";

/* The never type in the constructor ensures that TypeScript
   won't allow this error to be created. This is useful in
   switch blocks to check that all cases have been handled. */
export class InvalidAction extends Error {
  public constructor(val: never) {
    super(`Invalid action: ${val}`);
  }
}

export interface ConnectionChanged {
  type: typeof CONNECTION_CHANGED;
  payload: {
    pvName: string;
    value: ConnectionState;
  };
}

export interface Subscribe {
  type: typeof SUBSCRIBE;
  payload: {
    componentId: string;
    pvName: string;
    effectivePvName: string;
    type: SubscriptionType;
  };
}

export interface Unsubscribe {
  type: typeof UNSUBSCRIBE;
  payload: {
    componentId: string;
    pvName: string;
  };
}

export interface ValueChanged {
  type: typeof VALUE_CHANGED;
  payload: {
    pvName: string;
    value: DType;
  };
}

export interface ValuesChanged {
  type: typeof VALUES_CHANGED;
  payload: ValueChanged[];
}

export interface WritePv {
  type: typeof WRITE_PV;
  payload: {
    pvName: string;
    value: DType;
  };
}

export interface DeviceQueried {
  type: typeof DEVICE_QUERIED;
  payload: {
    device: string;
    value: DType;
  };
}

export interface QueryDevice {
  type: typeof QUERY_DEVICE;
  payload: {
    device: string;
  };
}

export type Action =
  | ConnectionChanged
  | Subscribe
  | Unsubscribe
  | ValueChanged
  | ValuesChanged
  | WritePv
  | DeviceQueried
  | QueryDevice;
