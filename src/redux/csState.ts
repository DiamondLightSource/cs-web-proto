import log from "loglevel";
import {
  VALUE_CHANGED,
  ActionType,
  SUBSCRIBE,
  WRITE_PV,
  CONNECTION_CHANGED,
  MACRO_UPDATED,
  UNSUBSCRIBE
} from "./actions";
import {
  VType,
  vdouble,
  vdoubleArray,
  VNumberBuilder,
  VNumberArrayBuilder,
  venum
} from "../vtypes/vtypes";
import { vstring } from "../vtypes/string";
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
  macroMap: { SUFFIX: "1" },
  subscriptions: {}
};

export interface PvState {
  value: VType;
  connected: boolean;
  readonly: boolean;
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
  macroMap: MacroMap;
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

const VNumbers: { [index: string]: VNumberBuilder } = {
  IVDouble: vdouble,
  VDouble: vdouble
};

const VNumberArrays: { [index: string]: VNumberArrayBuilder } = {
  IVDoubleArray: vdoubleArray,
  VDoubleArray: vdoubleArray
};

const mergeVtype = (original: VType, update: PartialVType): VType => {
  try {
    let className = update.type ? update.type : original.constructor.name;
    const array = update.hasOwnProperty("array")
      ? update.array
      : className.includes("Array");
    const value = update.hasOwnProperty("value")
      ? update.value
      : original.getValue();
    const alarmVal = update.alarm ? update.alarm : alarmOf(original);
    // should we require that the update has a time?
    const time = update.time ? update.time : timeOf(original);
    const display = update.display ? update.display : displayOf(original);
    if (className === "VString" || className === "IVString") {
      // what happened to VStringArray in VTypes?
      return vstring(value, alarmVal, time);
    } else if (className === "VEnum" || className === "IVEnum") {
      return venum(
        value.getIndex(),
        value.getDisplay().getChoices(),
        value.getAlarm(),
        value.getTime()
      );
    } else {
      if (array) {
        if (!className.endsWith("Array")) {
          className = `${className}Array`;
        }
        return VNumberArrays[className](
          value,
          value.length,
          alarmVal,
          time,
          display
        );
      } else {
        return VNumbers[className](value, alarmVal, time, display);
      }
    }
  } catch (error) {
    // This happens occasionally, and has serious consequences, but I
    // don't know why!
    log.error("failed to merge vtypes", original, update, error);
    return vstring(
      "error",
      alarm(AlarmSeverity.MAJOR, AlarmStatus.NONE, "error")
    );
  }
};

export function csReducer(state = initialState, action: ActionType): CsState {
  switch (action.type) {
    case VALUE_CHANGED: {
      const newValueCache: ValueCache = { ...state.valueCache };
      const { pvName, value } = action.payload;
      const pvState = state.valueCache[pvName];
      let newValue: VType;
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
      const newPvState = { ...pvState, connected: value.isConnected };
      newValueCache[action.payload.pvName] = newPvState;
      return { ...state, valueCache: newValueCache };
    }
    case MACRO_UPDATED: {
      const newMacroMap: MacroMap = { ...state.macroMap };
      newMacroMap[action.payload.key] = action.payload.value;
      return { ...state, macroMap: newMacroMap };
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
