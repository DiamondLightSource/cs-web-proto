import { csReducer, CsState } from "./csState";
import { VALUE_CHANGED, CONNECTION_CHANGED } from "./actions";
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
