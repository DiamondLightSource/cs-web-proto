import {
  VALUE_CHANGED,
  ActionType,
  SUBSCRIBE,
  WRITE_PV,
  CONNECTION_CHANGED
} from "./actions";
import { NType } from "../ntypes";

const initialState: CsState = {
  valueCache: {}
};

export interface PvState {
  value: NType;
  connected: boolean;
}

export interface ValueCache {
  [key: string]: PvState;
}

export interface CsState {
  valueCache: ValueCache;
}

export function csReducer(state = initialState, action: ActionType): CsState {
  switch (action.type) {
    case VALUE_CHANGED: {
      const newValueCache: ValueCache = Object.assign({}, state.valueCache);
      const pvState = state.valueCache[action.payload.pvName];
      const newPvState = Object.assign({}, pvState, {
        value: action.payload.value
      });
      newValueCache[action.payload.pvName] = newPvState;
      console.log("Value changed"); //eslint-disable-line no-console
      return Object.assign({}, state, { valueCache: newValueCache });
    }
    case CONNECTION_CHANGED: {
      const newValueCache: ValueCache = Object.assign({}, state.valueCache);
      const pvState = state.valueCache[action.payload.pvName];
      const newPvState = Object.assign({}, pvState, {
        connected: action.payload.value.isConnected
      });
      newValueCache[action.payload.pvName] = newPvState;
      console.log("Connection changed"); //eslint-disable-line no-console
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
