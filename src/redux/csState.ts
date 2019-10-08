import {
  VALUE_CHANGED,
  ActionType,
  SUBSCRIBE,
  WRITE_PV,
  CONNECTION_CHANGED,
  UNSUBSCRIBE
} from "./actions";
import { VType, vdoubleOf, vdoubleArrayOf } from "../vtypes/vtypes";
import { vstringOf } from "../vtypes/string";
import { Time, timeOf } from "../vtypes/time";
import { Display, displayOf } from "../vtypes/display";
import {
  Alarm,
  alarmOf,
  AlarmSeverity,
  AlarmStatus,
  alarm
} from "../vtypes/alarm";

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
  array?: boolean;
  base64?: string;
  alarm?: Alarm;
  time?: Time;
  display?: Display;
}

type VNumber = "VDouble";
type VNumberArray = "IVDoubleArray";

const VNumbers = {
  IVDouble: vdoubleOf,
  VDouble: vdoubleOf
};

const VNumberArrays = {
  IVDoubleArray: vdoubleArrayOf,
  VDoubleArray: vdoubleArrayOf
};

const mergeVtype = (original: VType, update: PartialVType): VType => {
  try {
    let className = update.type ? update.type : original.constructor.name;
    const array = update.array ? update.array : className.includes("Array");
    const value = update.value ? update.value : original.getValue();
    const alarm = update.alarm ? update.alarm : alarmOf(original);
    // should we require that the update has a time?
    const time = update.time ? update.time : timeOf(original);
    const display = update.display ? update.display : displayOf(original);
    if (className === "VString") {
      // what happened to VStringArray in VTypes?
      return vstringOf(value, alarm, time);
    } else {
      if (array) {
        if (!className.endsWith("Array")) {
          className = `${className}Array`;
        }
        return VNumberArrays[className as VNumberArray](
          value,
          alarm,
          time,
          display
        );
      } else {
        return VNumbers[className as VNumber](value, alarm, time, display);
      }
    }
  } catch (error) {
    // This happens occasionally, and has serious consequences, but I
    // don't know why!
    console.error("failed to merge vtypes", original, update, error);
    return vstringOf(
      "error",
      alarm(AlarmSeverity.MAJOR, AlarmStatus.NONE, "error")
    );
  }
};

export function csReducer(state = initialState, action: ActionType): CsState {
  switch (action.type) {
    case VALUE_CHANGED: {
      const newValueCache: ValueCache = Object.assign({}, state.valueCache);
      const pvState = state.valueCache[action.payload.pvName];
      const newValue = mergeVtype(pvState.value, action.payload.value);
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
