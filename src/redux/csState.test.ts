import { csReducer, CsState } from "./csState";
import {
  UNSUBSCRIBE,
  SUBSCRIBE,
  VALUE_CHANGED,
  CONNECTION_CHANGED
} from "./actions";
import { vdouble, VDoubleArray } from "../vtypes/vtypes";
import { AlarmSeverity, AlarmStatus, alarm } from "../vtypes/alarm";
import { VString } from "../vtypes/string";

const initialState: CsState = {
  valueCache: { PV: { value: vdouble(0), connected: true } },
  macroMap: {},
  subscriptions: {}
};

describe("VALUE_CHANGED", (): void => {
  test("csReducer handles value update", (): void => {
    const action = {
      type: VALUE_CHANGED,
      payload: { pvName: "PV", value: vdouble(1) }
    };
    const newState = csReducer(initialState, action);
    expect(newState.valueCache["PV"].value.getValue()).toEqual(1);
  });

  test("csReducer handles alarm update", (): void => {
    const majorAlarm = alarm(AlarmSeverity.MAJOR, AlarmStatus.NONE, "major");
    const action = {
      type: VALUE_CHANGED,
      payload: {
        pvName: "PV",
        value: { alarm: majorAlarm }
      }
    };
    const newState = csReducer(initialState, action);
    const newValue = newState.valueCache["PV"].value as VString;
    expect(newValue.getAlarm()).toEqual(majorAlarm);
  });

  test("csReducer handles type update", (): void => {
    const action = {
      type: VALUE_CHANGED,
      payload: {
        pvName: "PV",
        value: { type: "VString", value: "hello" }
      }
    };
    const newState = csReducer(initialState, action);
    const newValue = newState.valueCache["PV"].value as VString;
    expect(newValue.getValue()).toEqual("hello");
  });

  test("csReducer handles array type update", (): void => {
    const action = {
      type: VALUE_CHANGED,
      payload: {
        pvName: "PV",
        value: { type: "VDoubleArray", value: [1, 2, 3] }
      }
    };
    const newState = csReducer(initialState, action);
    const newValue = newState.valueCache["PV"].value as VDoubleArray;
    expect(newValue.getValue()).toEqual([1, 2, 3]);
  });

  test("csReducer catches error if type invalid", (): void => {
    const errorAlarm = alarm(AlarmSeverity.MAJOR, AlarmStatus.NONE, "error");
    const action = {
      type: VALUE_CHANGED,
      payload: {
        pvName: "PV",
        value: { type: "not-a-type" }
      }
    };
    const newState = csReducer(initialState, action);
    const newValue = newState.valueCache["PV"].value as VString;
    expect(newValue.getAlarm()).toEqual(errorAlarm);
  });
});

describe("CONNECTION_CHANGED", (): void => {
  test("csReducer handles value update", (): void => {
    const action = {
      type: CONNECTION_CHANGED,
      payload: { pvName: "PV", value: { isConnected: false } }
    };
    const newState = csReducer(initialState, action);
    expect(newState.valueCache["PV"].connected).toEqual(false);
  });
});

test("handles initializers", (): void => {
  const action = {
    type: SUBSCRIBE,
    payload: { pvName: "PV(1)", shortPvName: "PV", componentId: "0" }
  };
  const action2 = {
    type: SUBSCRIBE,
    payload: { pvName: "PV(1)", shortPvName: "PV", componentId: "1" }
  };
  const state2 = csReducer(initialState, action);
  const state3 = csReducer(state2, action2);
  expect(state3.shortPvNameMap["PV(1)"]).toEqual("PV");

  const unsubAction = {
    type: UNSUBSCRIBE,
    payload: { pvName: "PV(1)", componentId: "0" }
  };

  const unsubAction2 = {
    type: UNSUBSCRIBE,
    payload: { pvName: "PV(1)", componentId: "1" }
  };

  const state4 = csReducer(state3, unsubAction);
  expect(state4.shortPvNameMap["PV(1)"]).toEqual("PV");
  const state5 = csReducer(state4, unsubAction2);
  expect(state5.shortPvNameMap["PV(1)"]).toEqual(undefined);
});
