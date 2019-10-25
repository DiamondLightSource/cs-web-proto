import {
  VALUE_CHANGED,
  ActionType,
  SUBSCRIBE,
  WRITE_PV,
  CONNECTION_CHANGED,
  MACRO_UPDATED,
  UNSUBSCRIBE
} from "./actions";
import { VType } from "../vtypes/vtypes";
import { mergeVtype } from "../vtypes/merge";

const initialState: CsState = {
  valueCache: {},
  macroMap: { SUFFIX: "1" },
  shortPvNameMap: {},
  subscriptions: {}
};

export interface PvState {
  value: VType;
  connected: boolean;
  readonly: boolean;
  initializingPvName: string;
}

export interface ValueCache {
  [key: string]: PvState;
}

/* A simple dictionary from key to value. */
export interface MacroMap {
  [key: string]: string;
}

export interface Subscriptions {
  [pv: string]: string[];
}

/* The shape of the store for the entire application. */
export interface CsState {
  valueCache: ValueCache;
  shortPvNameMap: { [pvName: string]: string };
  macroMap: MacroMap;
  subscriptions: Subscriptions;
}

export function csReducer(state = initialState, action: ActionType): CsState {
  switch (action.type) {
    case VALUE_CHANGED: {
      const newValueCache: ValueCache = { ...state.valueCache };
      const { pvName, value } = action.payload;
      const pvState = state.valueCache[pvName];
      let newValue: VType | undefined;
      if (value instanceof VType) {
        newValue = value;
      } else {
        newValue = mergeVtype(pvState.value, value);
      }
      const newPvState = Object.assign({}, pvState, {
        value: newValue
      });
      newValueCache[action.payload.pvName] = newPvState;
      return { ...state, valueCache: newValueCache };
    }
    case CONNECTION_CHANGED: {
      const newValueCache: ValueCache = { ...state.valueCache };
      const { pvName, value } = action.payload;
      const pvState = state.valueCache[pvName];
      const newPvState = {
        ...pvState,
        connected: value.isConnected,
        readonly: value.isReadonly
      };
      newValueCache[action.payload.pvName] = newPvState;
      return { ...state, valueCache: newValueCache };
    }
    case MACRO_UPDATED: {
      const newMacroMap: MacroMap = { ...state.macroMap };
      newMacroMap[action.payload.key] = action.payload.value;
      return { ...state, macroMap: newMacroMap };
    }
    case SUBSCRIBE: {
      const { componentId, shortPvName } = action.payload;
      const newShortPvMap = { ...state.shortPvNameMap };
      const newSubscriptions = { ...state.subscriptions };
      if (newSubscriptions.hasOwnProperty(shortPvName)) {
        newSubscriptions[shortPvName].push(componentId);
      } else {
        newSubscriptions[shortPvName] = [componentId];
      }

      if (action.payload.pvName !== action.payload.shortPvName) {
        newShortPvMap[action.payload.pvName] = action.payload.shortPvName;
      }
      return {
        ...state,
        subscriptions: newSubscriptions,
        shortPvNameMap: newShortPvMap
      };
    }
    case UNSUBSCRIBE: {
      const newShortPvMap = { ...state.shortPvNameMap };
      let { componentId, pvName } = action.payload;
      const shortPvName = state.shortPvNameMap[pvName] || pvName;

      if (
        state.subscriptions[shortPvName].length === 1 &&
        state.subscriptions[shortPvName][0] === componentId
      ) {
        // O(n)
        Object.keys(newShortPvMap).forEach((key): void => {
          if (newShortPvMap[key] === shortPvName) {
            delete newShortPvMap[key];
          }
        });
      }

      const newSubscriptions = { ...state.subscriptions };
      const newPvSubs = state.subscriptions[shortPvName].filter(
        (id): boolean => id !== componentId
      );
      newSubscriptions[shortPvName] = newPvSubs;

      return {
        ...state,
        subscriptions: newSubscriptions,
        shortPvNameMap: newShortPvMap
      };
    }
    case WRITE_PV: {
      // Handled by middleware.
      break;
    }
  }
  return state;
}
