import log from "loglevel";
import {
  VALUE_CHANGED,
  VALUES_CHANGED,
  Action,
  SUBSCRIBE,
  SUBSCRIBE_DEVICE,
  WRITE_PV,
  CONNECTION_CHANGED,
  UNSUBSCRIBE,
  ValueChanged,
  UNSUBSCRIBE_DEVICE,
  DEVICE_CHANGED,
  DEVICES_CHANGED,
  DeviceChanged
} from "./actions";
import { MacroMap } from "../types/macros";
import { DType, mergeDType } from "../types/dtypes";

const initialState: CsState = {
  valueCache: {},
  globalMacros: { SUFFIX: "1" },
  effectivePvNameMap: {},
  subscriptions: {},
  deviceSubscriptions: {},
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
  [key: string]: FullPvState;
}

// TODO: Be more specific with type here
export interface DeviceCache {
  [key: string]: any;
}

export interface Subscriptions {
  [pv: string]: string[];
}

/* The shape of the store for the entire application. */
export interface CsState {
  valueCache: ValueCache;
  effectivePvNameMap: { [pvName: string]: string };
  globalMacros: MacroMap;
  subscriptions: Subscriptions;
  deviceSubscriptions: Subscriptions;
  deviceCache: DeviceCache;
}

/**
 * Merges new value of a pv with the old
 * pv metadata
 * @param oldValueCache
 * @param newValueCache
 * @param action
 */
function updateValueCache(
  oldValueCache: ValueCache,
  newValueCache: ValueCache,
  action: ValueChanged
): void {
  const { pvName, value } = action.payload;
  const pvState = oldValueCache[pvName];
  const newValue = mergeDType(pvState.value, value);
  const newPvState = Object.assign({}, pvState, {
    value: newValue
  });
  newValueCache[action.payload.pvName] = newPvState;
}

// TODO: Should probably make this a bit more extensive
function updateDeviceCache(
  oldDeviceCache: DeviceCache,
  newDeviceCache: DeviceCache,
  action: DeviceChanged
): void {
  const { value } = action.payload;
  console.log("new value", value);
  newDeviceCache[action.payload.device] = value;
}

export function csReducer(state = initialState, action: Action): CsState {
  log.debug(action);
  switch (action.type) {
    case VALUE_CHANGED: {
      const newValueCache: ValueCache = { ...state.valueCache };
      updateValueCache(state.valueCache, newValueCache, action);
      return { ...state, valueCache: newValueCache };
    }
    case DEVICE_CHANGED: {
      const newDeviceCache: DeviceCache = { ...state.deviceCache };
      updateDeviceCache(state.deviceCache, newDeviceCache, action);
      return { ...state, deviceCache: newDeviceCache };
    }
    case DEVICES_CHANGED: {
      const newDeviceCache: DeviceCache = { ...state.deviceCache };
      for (const changedAction of action.payload) {
        updateDeviceCache(state.deviceCache, newDeviceCache, changedAction);
      }
      return { ...state, deviceCache: newDeviceCache };
    }
    case VALUES_CHANGED: {
      const newValueCache: ValueCache = { ...state.valueCache };
      for (const changedAction of action.payload) {
        updateValueCache(state.valueCache, newValueCache, changedAction);
      }
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
    case SUBSCRIBE_DEVICE: {
      const { device, componentId } = action.payload;
      const newDeviceSubscriptions = { ...state.deviceSubscriptions };
      if (newDeviceSubscriptions.hasOwnProperty(device)) {
        newDeviceSubscriptions[device].push(componentId);
      } else {
        newDeviceSubscriptions[device] = [componentId];
      }
      return {
        ...state,
        deviceSubscriptions: newDeviceSubscriptions
      };
    }
    case UNSUBSCRIBE_DEVICE: {
      const { device, componentId } = action.payload;

      const newDeviceSubscriptions = { ...state.deviceSubscriptions };
      const newDeviceSubs = state.deviceSubscriptions[device].filter(
        (id): boolean => id !== componentId
      );
      if (newDeviceSubs.length > 0) {
        newDeviceSubscriptions[device] = newDeviceSubs;
      } else {
        delete newDeviceSubscriptions[device];
      }

      return {
        ...state,
        deviceSubscriptions: newDeviceSubscriptions
      };
    }
  }
  return state;
}
