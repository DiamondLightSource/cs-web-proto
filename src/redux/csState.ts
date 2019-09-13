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
  resolvedPvs: {}
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

/* The shape of the store for the entire application. */
export interface CsState {
  valueCache: ValueCache;
  macroMap: MacroMap;
  resolvedPvs: ResolvedPvs;
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
      return Object.assign({}, state, { valueCache: newValueCache });
    }
    case CONNECTION_CHANGED: {
      const newValueCache: ValueCache = Object.assign({}, state.valueCache);
      const pvState = state.valueCache[action.payload.pvName];
      const newPvState = Object.assign({}, pvState, {
        connected: action.payload.value.isConnected
      });
      newValueCache[action.payload.pvName] = newPvState;
      return Object.assign({}, state, { valueCache: newValueCache });
    }
    case MACRO_UPDATED: {
      const newMacroMap: MacroMap = Object.assign({}, state.macroMap);
      newMacroMap[action.payload.key] = action.payload.value;
      const newResolvedPvs: ResolvedPvs = Object.assign({}, state.resolvedPvs);
      for (var pv of Object.keys(newResolvedPvs)) {
        const resolvedPv = resolveMacros(pv, newMacroMap);
        newResolvedPvs[pv] = resolvedPv;
      }
      return Object.assign({}, state, {
        macroMap: newMacroMap,
        resolvedPvs: newResolvedPvs
      });
    }
    case PV_RESOLVED: {
      const { unresolvedPvName, resolvedPvName } = action.payload;
      const newResolvedPvs: ResolvedPvs = Object.assign({}, state.resolvedPvs);
      newResolvedPvs[unresolvedPvName] = resolvedPvName;
      return Object.assign({}, state, { resolvedPvs: newResolvedPvs });
    }
    case SUBSCRIBE: {
      // Handled by middleware.
      break;
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
