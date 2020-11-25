import { DType } from "../types/dtypes";
import { ConnectionState, SubscriptionType } from "../connection/plugin";

export const CONNECTION_CHANGED = "connection_changed";
export const SUBSCRIBE = "subscribe";
export const UNSUBSCRIBE = "unsubscribe";
export const VALUE_CHANGED = "value_changed";
export const VALUES_CHANGED = "values_changed";
export const WRITE_PV = "write_pv";
export const SUBSCRIBE_DEVICE = "subscribe_device";
export const DEVICE_CHANGED = "device_changed";
export const DEVICES_CHANGED = "devices_changed";
export const UNSUBSCRIBE_DEVICE = "unsubscribe_device";

export interface ConnectionChanged {
  type: typeof CONNECTION_CHANGED;
  payload: {
    pvDevice: string;
    type: string;
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

// TODO: Be more specific with type on value here
export interface SubscribeDevice {
  type: typeof SUBSCRIBE_DEVICE;
  payload: {
    device: string;
    componentId: string;
  };
}

export interface UnsubscribeDevice {
  type: typeof UNSUBSCRIBE_DEVICE;
  payload: {
    componentId: string;
    device: string;
  };
}

// TODO: Be more specific with type on value here
export interface DeviceChanged {
  type: typeof DEVICE_CHANGED;
  payload: {
    device: string;
    componentId: string;
    value: string;
  };
}

export interface DevicesChanged {
  type: typeof DEVICES_CHANGED;
  payload: DeviceChanged[];
}

export interface WritePv {
  type: typeof WRITE_PV;
  payload: {
    pvName: string;
    value: DType;
  };
}

export type Action =
  | ConnectionChanged
  | Subscribe
  | Unsubscribe
  | ValueChanged
  | ValuesChanged
  | WritePv
  | DeviceChanged
  | DevicesChanged
  | UnsubscribeDevice
  | SubscribeDevice;
