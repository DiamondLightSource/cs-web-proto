import { PV_CHANGED, ActionType, SUBSCRIBE } from "./actions";

interface ValueCache {
  [key: string]: any;
}

interface StoreType {
  valueCache: ValueCache;
}

const initialState: StoreType = {
  valueCache: {}
};

export function csReducer(state = initialState, action: ActionType) {
  switch (action.type) {
    case PV_CHANGED: {
      const newValueCache: ValueCache = Object.assign({}, state.valueCache);
      newValueCache[action.payload.pvName] = action.payload.value;
      return Object.assign({}, state, { valueCache: newValueCache });
    }
    case SUBSCRIBE: {
      console.log("create connection");
    }
  }
  return state;
}
