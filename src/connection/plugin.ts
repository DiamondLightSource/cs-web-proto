import { NType } from "../cs";

export interface ConnectionPlugin {
  subscribe: (pvName: string) => void;
  putPv: (pvName: string, value: NType) => void;
  getValue: (pvName: string) => NType;
}
