import log from "loglevel";
import {
  VALUE_CHANGED,
  Action,
  SUBSCRIBE,
  WRITE_PV,
  CONNECTION_CHANGED,
  MACRO_UPDATED,
  UNSUBSCRIBE
} from "./actions";
import { VType } from "../types/vtypes/vtypes";
import { mergeVtype } from "../types/vtypes/merge";

const initialState: CsState = {
  valueCache: {},
  macroMap: { SUFFIX: "1" },
  effectivePvNameMap: {},
  subscriptions: {}
};

export interface PvState {
  value?: VType;
  connected: boolean;
  readonly: boolean;
}

export interface FullPvState extends PvState {
  initializingPvName: string;
}

export interface ValueCache {
  [key: string]: FullPvState;
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
  effectivePvNameMap: { [pvName: string]: string };
  macroMap: MacroMap;
  subscriptions: Subscriptions;
}

export function csReducer(state = initialState, action: Action): CsState {
  log.debug(action);
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
      const { componentId, effectivePvName } = action.payload;
      const newEffectivePvMap = { ...state.effectivePvNameMap };
      const newSubscriptions = { ...state.subscriptions };
      if (newSubscriptions.hasOwnProperty(effectivePvName)) {
        newSubscriptions[effectivePvName].push(componentId);
      } else {
        newSubscriptions[effectivePvName] = [componentId];
      }

      if (action.payload.pvName !== action.payload.effectivePvName) {
        newEffectivePvMap[action.payload.pvName] =
          action.payload.effectivePvName;
      }
      return {
        ...state,
        subscriptions: newSubscriptions,
        effectivePvNameMap: newEffectivePvMap
      };
    }
    case UNSUBSCRIBE: {
      const newEffectivePvMap = { ...state.effectivePvNameMap };
      const { componentId, pvName } = action.payload;
      const effectivePvName = state.effectivePvNameMap[pvName] || pvName;

      if (
        state.subscriptions[effectivePvName].length === 1 &&
        state.subscriptions[effectivePvName][0] === componentId
      ) {
        // O(n)
        Object.keys(newEffectivePvMap).forEach((key): void => {
          if (newEffectivePvMap[key] === effectivePvName) {
            delete newEffectivePvMap[key];
          }
        });
      }

      const newSubscriptions = { ...state.subscriptions };
      const newPvSubs = state.subscriptions[effectivePvName].filter(
        (id): boolean => id !== componentId
      );
      newSubscriptions[effectivePvName] = newPvSubs;

      return {
        ...state,
        subscriptions: newSubscriptions,
        effectivePvNameMap: newEffectivePvMap
      };
    }
    case WRITE_PV: {
      // Handled by middleware.
      break;
    }
  }
  return state;
}
