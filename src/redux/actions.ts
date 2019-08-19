export const SUBSCRIBE = "subscribe";
export const UNSUBSCRIBE = "unsubscribe";
export const PV_CHANGED = "pv_changed";
export const WRITE_PV = "write_pv";

export interface Action {
  type: string;
  payload: any;
}

export type ActionType = Action;
