import { NType } from "../cs";
import { ConiqlPlugin } from "./coniql";

export type ConnectionCallback = (pvName:string, value:NType) => void;

export interface Connection {
  subscribe: (pvName: string) => void;
  putPv: (pvName: string, value: NType) => void;
  getValue: (pvName: string) => NType;
  connect: (callback:ConnectionCallback) => void;
  isConnected: () => boolean;
}
