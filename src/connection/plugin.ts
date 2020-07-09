import { DType } from "../types/dtypes";

export interface SubscriptionType {
  double?: boolean;
  string?: boolean;
  base64Array?: boolean;
  stringArray?: boolean;
  display?: boolean;
  timestamp?: boolean;
}

export const nullConnCallback: ConnectionChangedCallback = (_p, _v): void => {};
export const nullValueCallback: ValueChangedCallback = (_p, _v): void => {};
export const nullDeviceQueryCallback: DeviceQueryCallback = (_p, _v): void => {};

export interface ConnectionState {
  isConnected: boolean;
  isReadonly: boolean;
}

export type ConnectionChangedCallback = (
  pvName: string,
  value: ConnectionState
) => void;
export type ValueChangedCallback = (pvName: string, value: DType) => void;
export type DeviceQueryCallback = (deviceName: string, value: string) => void;

export interface Connection {
  subscribe: (pvName: string, type: SubscriptionType) => string; // must be idempotent
  subscribe_device: (deviceName: string) => string;
  putPv: (pvName: string, value: DType) => void;
  connect: (
    connectionCallback: ConnectionChangedCallback,
    valueCallback: ValueChangedCallback,
    deviceQueryCallback: DeviceQueryCallback
  ) => void;
  isConnected: () => boolean;
  unsubscribe: (pvName: string) => void;
}
