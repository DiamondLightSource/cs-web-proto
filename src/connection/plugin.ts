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
export const nullDeviceCallback: DeviceChangedCallback = (_d, _v): void => {};

export interface ConnectionState {
  isConnected: boolean;
  isReadonly: boolean;
}

export type ConnectionChangedCallback = (
  pvDevice: string,
  type: string,
  value: ConnectionState
) => void;
export type ValueChangedCallback = (pvName: string, value: DType) => void;
export type DeviceChangedCallback = (device: string, value: DType) => void;

export type Connection = {
  subscribe: (pvDevice: string, type: SubscriptionType) => string; // must be idempotent
  connect: (
    connectionCallback: ConnectionChangedCallback,
    valueCallback: ValueChangedCallback,
    deviceCallback: DeviceChangedCallback
  ) => void;
  isConnected: () => boolean;
  unsubscribe: (pvName: string) => void;
};

// Left for easy expansion and easier to understand type definitions
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ConiqlDeviceConnection extends Connection {}

export interface PvConnection extends Connection {
  putPv: (pvName: string, value: DType) => void;
}

export type ConnectionTypes = PvConnection | ConiqlDeviceConnection;
