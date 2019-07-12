import { PV_CHANGED, ActionType, CREATE_CONNECTION } from "./actions";

interface ValueCache {
    [key: string]: any;
}

interface StoreType {
    valueCache: ValueCache;
}

const initialState: StoreType = {
    valueCache: {}
}

export function csReducer(state = initialState, action: ActionType) {

    console.log(`reducing ${action.type}`);
    switch (action.type) {

        case PV_CHANGED: {
            console.log('pv changed')
            const newValueCache: ValueCache = Object.assign({}, state.valueCache);
            newValueCache[action.payload.pvName] = action.payload.value;
            return Object.assign({}, state, {valueCache: newValueCache});
        }
        case CREATE_CONNECTION: {
            console.log('create connection')
            const newValueCache: ValueCache = Object.assign({}, state.valueCache);
            newValueCache[action.payload.pvName] = "this is a longer val";
            const newState = Object.assign({}, state, {valueCache: newValueCache});
            console.log(newState);
            return newState;
        }
    }
    return state;
}