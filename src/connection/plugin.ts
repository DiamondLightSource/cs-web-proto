import { NType } from "../ntypes";

export const nullConnCallback: ConnectionChangedCallback = (_p, _v): void => {};
export const nullValueCallback: ValueChangedCallback = (_p, _v): void => {};

export interface ConnectionState {
  isConnected: boolean;
}

export type ConnectionChangedCallback = (
  pvName: string,
  value: ConnectionState
) => void;
export type ValueChangedCallback = (pvName: string, value: NType) => void;

export interface Connection {
  subscribe: (pvName: string) => void;
  putPv: (pvName: string, value: NType) => void;
  getValue: (pvName: string) => NType;
  connect: (
    connectionCallback: ConnectionChangedCallback,
    valueCallback: ValueChangedCallback
  ) => void;
  isConnected: () => boolean;
}
