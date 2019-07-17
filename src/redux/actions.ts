export const SUBSCRIBE: string = 'subscribe';
export const UNSUBSCRIBE: string = 'unsubscribe';
export const PV_CHANGED: string = 'pv_update';
export const WRITE_PV: string = 'pv_update';


export interface Action {
    type: string
    payload: any
}

export type ActionType = Action;