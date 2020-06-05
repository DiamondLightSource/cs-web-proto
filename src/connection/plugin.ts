import { DType } from "../types/dtypes";

export enum PVTypeOld {
  DOUBLE,
  STRING,
  STRINGNUM,
  ARRAY
}

export interface PVType {
  double?: boolean;
  string?: boolean;
  base64Array?: boolean;
  stringArray?: boolean;
  display?: boolean;
  timestamp?: boolean;
}

export const nullConnCallback: ConnectionChangedCallback = (_p, _v): void => {};
export const nullValueCallback: ValueChangedCallback = (_p, _v): void => {};

export interface ConnectionState {
  isConnected: boolean;
  isReadonly: boolean;
}

export type ConnectionChangedCallback = (
  pvName: string,
  value: ConnectionState
) => void;
export type ValueChangedCallback = (pvName: string, value: DType) => void;

export interface Connection {
  subscribe: (pvName: string, type: PVType) => string; // must be idempotent
  putPv: (pvName: string, value: DType) => void;
  connect: (
    connectionCallback: ConnectionChangedCallback,
    valueCallback: ValueChangedCallback
  ) => void;
  isConnected: () => boolean;
  unsubscribe: (pvName: string) => void;
}
