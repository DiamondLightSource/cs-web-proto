import {
  CsState,
  PvState,
  FullPvState,
  FullDeviceState
} from "../../redux/csState";
import {
  pvStateSelector,
  pvStateComparator,
  PvArrayResults,
  deviceSelector,
  deviceComparator
} from "./utils";

const pv1 = "pv1";
const pv2 = "pv2";
const pv3 = "pv3";
const pvState: FullPvState = {
  value: undefined,
  connected: true,
  readonly: true,
  initializingPvName: pv1
};
const deviceState: FullDeviceState = {
  value: undefined,
  connected: true,
  readonly: true,
  device: "fakeDevice"
};

const state: CsState = {
  valueCache: { pv1: pvState },
  globalMacros: {},
  effectivePvNameMap: { pv1: "pv1", pv2: "pv3" },
  subscriptions: {},
  deviceCache: { fakeDevice: deviceState },
  deviceSubscriptions: {}
};

describe("pvStateSelector", (): void => {
  it("returns appropriate values if PV present", (): void => {
    const results = pvStateSelector([pv1], state);
    const [pvState, effectivePv] = results[pv1];
    expect(pvState).toEqual(pvState);
    expect(effectivePv).toEqual(pv1);
  });

  it("returns correct effective PV name", (): void => {
    const results = pvStateSelector([pv2], state);
    const [pvState, effectivePv] = results[pv2];
    expect(pvState).toBeUndefined();
    expect(effectivePv).toEqual(pv3);
  });

  it("returns appropriate values if PV not present", (): void => {
    const results = pvStateSelector(["not-a-pv"], state);
    const [pvState, shortName] = results["not-a-pv"];
    expect(pvState).toBeUndefined();
    expect(shortName).toEqual("not-a-pv");
  });
});

describe("pvStateComparator", (): void => {
  const singleResult: PvArrayResults = {
    pv1: [pvState, "pv1"]
  };

  it("returns true if the same object is passed twice", (): void => {
    expect(pvStateComparator(singleResult, singleResult)).toBe(true);
  });

  it("returns true if different objects have a reference to the same PvState objects", (): void => {
    const anotherSingleResult: PvArrayResults = {
      pv1: [pvState, "pv1"]
    };
    expect(pvStateComparator(singleResult, anotherSingleResult)).toBe(true);
  });

  it("returns false if different objects have a reference to different PvState objects", (): void => {
    const similarPvState: PvState = {
      value: undefined,
      connected: true,
      readonly: true
    };
    const anotherSingleResult: PvArrayResults = {
      pv1: [similarPvState, "pv1"]
    };
    expect(pvStateComparator(singleResult, anotherSingleResult)).toBe(false);
  });
});

describe("deviceSelector", (): void => {
  it("returns appropriate device value if available", () => {
    const result = deviceSelector("fakeDevice", state);
    expect(result.device).toEqual("fakeDevice");
  });

  it("returns undefined if a device is not available", (): void => {
    const result = deviceSelector("anotherFakeDevice", state);
    expect(result).toBeUndefined();
  });
});

describe("deviceComparator", (): void => {
  it("returns true if the same object is passed twice", (): void => {
    expect(deviceComparator(deviceState, deviceState)).toBe(true);
  });

  it("returns true if one is a copy of the other", (): void => {
    const newDevice: FullDeviceState = { ...deviceState };
    expect(deviceComparator(deviceState, newDevice)).toBe(true);
  });

  it("returns false if both match but one has an extra property", (): void => {
    const newDevice = { ...deviceState };
    newDevice.newValue = "5";
    expect(deviceComparator(deviceState, newDevice)).toBe(false);
  });

  it("returns false one property doesn't match", (): void => {
    const newDevice = { ...deviceState };
    newDevice.connected = !newDevice.connected;
    expect(deviceComparator(deviceState, newDevice)).toBe(false);
  });
});
