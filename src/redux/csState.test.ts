import { csReducer, CsState } from "./csState";
import { VALUE_CHANGED } from "./actions";
import { vdouble } from "../vtypes/vtypes";
import { AlarmSeverity, AlarmStatus, alarm } from "../vtypes/alarm";

const initialState: CsState = {
  valueCache: { PV: { value: vdouble(0), connected: false } },
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
    expect(newState.valueCache["PV"].value.getAlarm()).toEqual(majorAlarm);
  });
});
