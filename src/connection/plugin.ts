import { NType } from "../ntypes";
import { ConnectionState } from "../redux/connectionMiddleware";

export const nullConnCallback: ConnectionChangedCallback = (_p, _v): void => {};
export const nullValueCallback: ValueChangedCallback = (_p, _v): void => {};

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
