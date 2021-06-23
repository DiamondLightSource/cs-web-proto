import log from "loglevel";
import {
  VALUE_CHANGED,
  VALUES_CHANGED,
  DEVICE_QUERIED,
  Action,
  SUBSCRIBE,
  WRITE_PV,
  CONNECTION_CHANGED,
  UNSUBSCRIBE,
  ValueChanged
} from "./actions";
import { MacroMap } from "../types/macros";
import { DType, mergeDType } from "../types/dtypes";

const initialState: CsState = {
  valueCache: {},
  globalMacros: { SUFFIX: "1" },
  effectivePvNameMap: {},
  subscriptions: {},
  deviceCache: {}
};

export interface PvState {
  value?: DType;
  connected: boolean;
  readonly: boolean;
}

export interface FullPvState extends PvState {
  initializingPvName: string;
}

export interface ValueCache {
  [pvName: string]: FullPvState;
}

export interface Subscriptions {
  [pvName: string]: string[];
}

export interface DeviceCache {
  [deviceName: string]: DType;
}

/* The shape of the store for the entire application. */
export interface CsState {
  valueCache: ValueCache;
  effectivePvNameMap: { [pvName: string]: string };
  globalMacros: MacroMap;
  subscriptions: Subscriptions;
  deviceCache: DeviceCache;
}

/* Given a new object that is a shallow copy of the original
   valueCache, update with contents of a ValueChanged action. */
function updateValueCache(
  newValueCache: ValueCache,
  action: ValueChanged
): void {
  const { pvName, value } = action.payload;
  // New PvState object.
  const newPvState = { ...newValueCache[pvName] };
  // New DType object.
  const newValue = mergeDType(newPvState.value, value);
  newPvState.value = newValue;
  newValueCache[pvName] = newPvState;
}

export function csReducer(state = initialState, action: Action): CsState {
  log.debug(action);
  switch (action.type) {
    case VALUE_CHANGED: {
      const newValueCache: ValueCache = { ...state.valueCache };
      updateValueCache(newValueCache, action);
      return { ...state, valueCache: newValueCache };
    }
    case VALUES_CHANGED: {
      const newValueCache: ValueCache = { ...state.valueCache };
      for (const changedAction of action.payload) {
        updateValueCache(newValueCache, changedAction);
      }
      return { ...state, valueCache: newValueCache };
    }
    case CONNECTION_CHANGED: {
      const newValueCache: ValueCache = { ...state.valueCache };
      const { pvName, value } = action.payload;
      const pvState = newValueCache[pvName];
      const newPvState = {
        ...pvState,
        connected: value.isConnected,
        readonly: value.isReadonly
      };
      newValueCache[action.payload.pvName] = newPvState;
      return { ...state, valueCache: newValueCache };
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
    case DEVICE_QUERIED: {
      const { device, value } = action.payload;
      const newDeviceState = { ...state.deviceCache };
      newDeviceState[device] = value;
      return {
        ...state,
        deviceCache: newDeviceState
      };
    }
  }
  return state;
}
