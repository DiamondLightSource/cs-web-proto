import {Dispatch, Store} from 'redux';
import {ConnectionPlugin} from '../connection/plugin';
import {ActionType, CREATE_CONNECTION} from './actions';

let connection: ConnectionPlugin | null = null;

/* Cheating with the types here. */
export const connectionMiddleware = (store: any) => (next: any) => (action: any) => {

    console.log(`middleware ${action.type}`)
    switch (action.type) {
        case CREATE_CONNECTION: {
            if (connection === null) {
                connection = new ConnectionPlugin(
                    action.payload.url,
                    action.payload.pvName
                )
            }
        }
    }
    return next(action);

};