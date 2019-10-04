import {
  VALUE_CHANGED,
  ActionType,
  SUBSCRIBE,
  WRITE_PV,
  CONNECTION_CHANGED,
  UNSUBSCRIBE
} from "./actions";
import { VType } from "../vtypes/vtypes";
import { Time } from "../vtypes/time";
import { Display } from "../vtypes/display";
import { Alarm } from "../vtypes/alarm";

const initialState: CsState = {
  valueCache: {},
  subscriptions: {}
};

export interface PvState {
  value: VType;
  connected: boolean;
}

export interface ValueCache {
  [key: string]: PvState;
}

export interface Subscriptions {
  [pv: string]: string[];
}

export interface CsState {
  valueCache: ValueCache;
  subscriptions: Subscriptions;
}

export interface PartialVType {
  type?: string;
  value?: any;
  alarm?: Alarm;
  time?: Time;
  display?: Display;
}

export function csReducer(state = initialState, action: ActionType): CsState {
  switch (action.type) {
    case VALUE_CHANGED: {
      const newValueCache: ValueCache = Object.assign({}, state.valueCache);
      const pvState = state.valueCache[action.payload.pvName];
      const oldValue = pvState.value;
      //console.log("update");
      //console.log(action.payload.value);
      const newValue = { ...oldValue, ...action.payload.value };
      //console.log("new value");
      //console.log(newValue);
      const newPvState = Object.assign({}, pvState, {
        value: newValue
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
    case WRITE_PV: {
      // Handled by middleware.
      break;
    }
  }
  return state;
}
