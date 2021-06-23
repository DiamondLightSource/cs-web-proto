import { csReducer, CsState } from "./csState";
import {
  UNSUBSCRIBE,
  SUBSCRIBE,
  VALUE_CHANGED,
  CONNECTION_CHANGED,
  ConnectionChanged,
  Subscribe,
  Unsubscribe,
  ValueChanged,
  ValuesChanged,
  VALUES_CHANGED,
  DeviceQueried,
  DEVICE_QUERIED
} from "./actions";
import { AlarmQuality, DAlarm, DType } from "../types/dtypes";
import { ddouble, dstring, ddoubleArray } from "../testResources";

const initialState: CsState = {
  valueCache: {
    PV: {
      value: ddouble(0),
      connected: true,
      readonly: false,
      initializingPvName: ""
    }
  },
  globalMacros: {},
  subscriptions: {},
  effectivePvNameMap: {},
  deviceCache: {}
};

describe("VALUES_CHANGED", (): void => {
  test("csReducer honours latest of multiple value updates", (): void => {
    const action: ValuesChanged = {
      type: VALUES_CHANGED,
      payload: [
        { type: VALUE_CHANGED, payload: { pvName: "PV", value: ddouble(1) } },
        { type: VALUE_CHANGED, payload: { pvName: "PV", value: ddouble(2) } }
      ]
    };
    const newState = csReducer(initialState, action);
    // expect the latter value
    expect(newState.valueCache["PV"].value?.getDoubleValue()).toEqual(2);
  });
  test("csReducer merges multiple value updates", (): void => {
    const action: ValuesChanged = {
      type: VALUES_CHANGED,
      payload: [
        { type: VALUE_CHANGED, payload: { pvName: "PV", value: ddouble(1) } },
        {
          type: VALUE_CHANGED,
          payload: {
            pvName: "PV",
            value: new DType(
              {},
              new DAlarm(AlarmQuality.ALARM, ""),
              undefined,
              undefined,
              true
            )
          }
        }
      ]
    };
    const newState = csReducer(initialState, action);
    // value from first update and alarm from second update
    expect(newState.valueCache["PV"].value?.getDoubleValue()).toEqual(1);
    expect(newState.valueCache["PV"].value?.getAlarm().quality).toEqual(
      AlarmQuality.ALARM
    );
  });
});

describe("VALUE_CHANGED", (): void => {
  test("csReducer handles value update", (): void => {
    const action: ValueChanged = {
      type: VALUE_CHANGED,
      payload: { pvName: "PV", value: ddouble(1) }
    };
    const newState = csReducer(initialState, action);
    expect(newState?.valueCache["PV"].value?.getDoubleValue()).toEqual(1);
  });

  test("csReducer handles alarm update", (): void => {
    const majorAlarm = DAlarm.MAJOR;
    const action: ValueChanged = {
      type: VALUE_CHANGED,
      payload: {
        pvName: "PV",
        value: ddouble(0, majorAlarm)
      }
    };
    const newState = csReducer(initialState, action);
    const newValue = newState.valueCache["PV"].value;
    expect(newValue?.getAlarm()).toEqual(majorAlarm);
  });

  test("csReducer handles type update", (): void => {
    const action: ValueChanged = {
      type: VALUE_CHANGED,
      payload: {
        pvName: "PV",
        value: dstring("hello")
      }
    };
    const newState = csReducer(initialState, action);
    const newValue = newState.valueCache["PV"].value;
    expect(newValue?.getStringValue()).toEqual("hello");
  });

  test("csReducer handles array type update", (): void => {
    const action: ValueChanged = {
      type: VALUE_CHANGED,
      payload: {
        pvName: "PV",
        value: ddoubleArray([1, 2, 3])
      }
    };
    const newState = csReducer(initialState, action);
    const newValue = newState.valueCache["PV"].value;
    expect(newValue?.getArrayValue()).toEqual(Float64Array.from([1, 2, 3]));
  });
});

describe("CONNECTION_CHANGED", (): void => {
  test("csReducer handles value update", (): void => {
    const action: ConnectionChanged = {
      type: CONNECTION_CHANGED,
      payload: { pvName: "PV", value: { isConnected: false, isReadonly: true } }
    };
    const newState = csReducer(initialState, action);
    expect(newState.valueCache["PV"].connected).toEqual(false);
  });
});

describe("DEVICE_QUERIED", (): void => {
  test("csReducer adds device to deviceCache", (): void => {
    const dtype = new DType({ stringValue: "42" });
    const deviceName = "testDevice";
    const action: DeviceQueried = {
      type: DEVICE_QUERIED,
      payload: { device: deviceName, value: dtype }
    };

    const newState = csReducer(initialState, action);
    expect(newState.deviceCache[deviceName]).toEqual(dtype);
  });
});

test("handles initializers", (): void => {
  const action: Subscribe = {
    type: SUBSCRIBE,
    payload: {
      pvName: "PV(1)",
      effectivePvName: "PV",
      componentId: "0",
      type: { double: true }
    }
  };
  const action2: Subscribe = {
    type: SUBSCRIBE,
    payload: {
      pvName: "PV(1)",
      effectivePvName: "PV",
      componentId: "1",
      type: { double: true }
    }
  };
  const state2 = csReducer(initialState, action);
  const state3 = csReducer(state2, action2);
  expect(state3.effectivePvNameMap["PV(1)"]).toEqual("PV");

  const unsubAction: Unsubscribe = {
    type: UNSUBSCRIBE,
    payload: { pvName: "PV(1)", componentId: "0" }
  };

  const unsubAction2: Unsubscribe = {
    type: UNSUBSCRIBE,
    payload: { pvName: "PV(1)", componentId: "1" }
  };

  const state4 = csReducer(state3, unsubAction);
  expect(state4.effectivePvNameMap["PV(1)"]).toEqual("PV");
  const state5 = csReducer(state4, unsubAction2);
  expect(state5.effectivePvNameMap["PV(1)"]).toEqual(undefined);
});
