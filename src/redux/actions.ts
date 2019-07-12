export const CREATE_CONNECTION: string = 'create-connection';
export const PV_CHANGED: string = 'pv_update';


export interface Action {
    type: string
    payload: any
}

export type ActionType = Action;