export const CONNECTION_CHANGED = "connection_changed";
export const SUBSCRIBE = "subscribe";
export const UNSUBSCRIBE = "unsubscribe";
export const VALUE_CHANGED = "value_changed";
export const VALUES_CHANGED = "values_changed";
export const WRITE_PV = "write_pv";
export const MACRO_UPDATED = "macro_updated";

export interface Action {
  type: string;
  payload: any;
}

export type ActionType = Action;
