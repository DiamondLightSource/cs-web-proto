import {
  VALUE_CHANGED,
  ActionType,
  SUBSCRIBE,
  WRITE_PV,
  CONNECTION_CHANGED,
  MACRO_UPDATED,
  UNSUBSCRIBE,
  PV_RESOLVED
} from "./actions";
import { NType } from "../ntypes";
import { resolveMacros } from "../macros";

const initialState: CsState = {
  valueCache: {},
  macroMap: { SUFFIX: "1" },
  resolvedPvs: {},
  subscriptions: {}
};

export interface PvState {
  value: NType;
  connected: boolean;
}

export interface ValueCache {
  [key: string]: PvState;
}

/* A simple dictionary from key to value. */
export interface MacroMap {
  [key: string]: string;
}

/* A simple dictionary from unresolved PV to resolved PV.
   e.g. A${B} -> AC
*/
export interface ResolvedPvs {
  [key: string]: string;
}

export interface Subscriptions {
  [pv: string]: string[];
}

/* The shape of the store for the entire application. */
export interface CsState {
  valueCache: ValueCache;
  macroMap: MacroMap;
  resolvedPvs: ResolvedPvs;
  subscriptions: Subscriptions;
}

export function csReducer(state = initialState, action: ActionType): CsState {
  switch (action.type) {
    case VALUE_CHANGED: {
      const newValueCache: ValueCache = { ...state.valueCache };
      const pvState = state.valueCache[action.payload.pvName];
      const newPvState = { ...pvState, value: action.payload.value };
      newValueCache[action.payload.pvName] = newPvState;
      return { ...state, valueCache: newValueCache };
    }
    case CONNECTION_CHANGED: {
      const newValueCache: ValueCache = { ...state.valueCache };
      const { pvName, value } = action.payload;
      const pvState = state.valueCache[pvName];
      const newPvState = { ...pvState, connected: value.isConnected };
      newValueCache[action.payload.pvName] = newPvState;
      return { ...state, valueCache: newValueCache };
    }
    case MACRO_UPDATED: {
      const newMacroMap: MacroMap = { ...state.macroMap };
      newMacroMap[action.payload.key] = action.payload.value;
      const newResolvedPvs: ResolvedPvs = { ...state.resolvedPvs };
      // If macros are updated we need to re-resolve PVs.
      for (var pv of Object.keys(newResolvedPvs)) {
        const resolvedPv = resolveMacros(pv, newMacroMap);
        newResolvedPvs[pv] = resolvedPv;
      }
      return { ...state, macroMap: newMacroMap, resolvedPvs: newResolvedPvs };
    }
    case PV_RESOLVED: {
      const { unresolvedPvName, resolvedPvName } = action.payload;
      const newResolvedPvs: ResolvedPvs = { ...state.resolvedPvs };
      newResolvedPvs[unresolvedPvName] = resolvedPvName;
      return { ...state, resolvedPvs: newResolvedPvs };
    }
    case SUBSCRIBE: {
      const { componentId, pvName } = action.payload;
      const newSubscriptions = { ...state.subscriptions };
      if (newSubscriptions.hasOwnProperty(pvName)) {
        newSubscriptions[pvName].push(componentId);
      } else {
        newSubscriptions[pvName] = [componentId];
      }
      return { ...state, subscriptions: newSubscriptions };
    }
    case UNSUBSCRIBE: {
      const { componentId, pvName } = action.payload;
      const newSubscriptions = { ...state.subscriptions };
      const newPvSubs = state.subscriptions[pvName].filter(
        (id): boolean => id !== componentId
      );
      newSubscriptions[pvName] = newPvSubs;
      return { ...state, subscriptions: newSubscriptions };
    }
    case UNSUBSCRIBE: {
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
