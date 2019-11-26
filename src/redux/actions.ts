import { ConnectionState } from "../connection/plugin";
import { VType } from "../vtypes/vtypes";

export const CONNECTION_CHANGED = "connection_changed";
export const SUBSCRIBE = "subscribe";
export const UNSUBSCRIBE = "unsubscribe";
export const VALUE_CHANGED = "value_changed";
export const WRITE_PV = "write_pv";
export const MACRO_UPDATED = "macro_updated";

/* The never type in the constructor ensures that TypeScript
   won't allow this error to be created. This is useful in
   switch blocks to check that all cases have been handled. */
export class InvalidAction extends Error {
  public constructor(val: never) {
    console.log("the object is");
    console.log(val);
    super(`Invalid action: ${val}`);
  }
}

export interface ConnectionChanged {
  type: typeof CONNECTION_CHANGED;
  payload: {
    pvName: string;
    value: ConnectionState;
  };
}

export interface Subscribe {
  type: typeof SUBSCRIBE;
  payload: {
    componentId: string;
    pvName: string;
    effectivePvName: string;
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
    value: VType;
  };
}

export interface WritePv {
  type: typeof WRITE_PV;
  payload: {
    pvName: string;
    value: VType;
  };
}

export interface MacroUpdated {
  type: typeof MACRO_UPDATED;
  payload: {
    key: string;
    value: string;
  };
}

export type Action =
  | ConnectionChanged
  | Subscribe
  | Unsubscribe
  | ValueChanged
  | WritePv
  | MacroUpdated;
