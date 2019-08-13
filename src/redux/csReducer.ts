import { PV_CHANGED, ActionType, SUBSCRIBE, WRITE_PV } from "./actions";
import { NType } from "../cs";

interface ValueCache {
  [key: string]: NType;
}

export interface CsStore {
  valueCache: ValueCache;
}

const initialState: CsStore = {
  valueCache: {}
};

export function csReducer(state = initialState, action: ActionType): CsStore {
  switch (action.type) {
    case PV_CHANGED: {
      const newValueCache: ValueCache = Object.assign({}, state.valueCache);
      newValueCache[action.payload.pvName] = action.payload.value;
      return Object.assign({}, state, { valueCache: newValueCache });
    }
    case SUBSCRIBE: {
      // Handled by middleware.
      break;
    }
    case WRITE_PV: {
      // Handled by middleware.
      break;
    }
  }
  return state;
}
