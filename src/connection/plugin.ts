import { NType } from "../ntypes";
import { ConnectionState } from "../redux/connectionMiddleware";

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
