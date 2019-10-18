import { VType } from "../vtypes/vtypes";
import { PartialVType } from "../redux/csState";

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
export type ValueChangedCallback = (
  pvName: string,
  value: VType | PartialVType
) => void;

export interface Connection {
  subscribe: (pvName: string) => void;
  putPv: (pvName: string, value: VType) => void;
  connect: (
    connectionCallback: ConnectionChangedCallback,
    valueCallback: ValueChangedCallback
  ) => void;
  isConnected: () => boolean;
  unsubscribe: (pvName: string) => void;
}
