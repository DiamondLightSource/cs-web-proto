import { CsState, PvState, FullPvState } from "../../redux/csState";
import { pvStateSelector, pvStateComparator, PvArrayResults } from "./utils";

const pv1 = "pv1";
const pv2 = "pv2";
const pv3 = "pv3";
const pvState: FullPvState = {
  value: undefined,
  connected: true,
  readonly: true,
  initializingPvName: pv1
};

const state: CsState = {
  valueCache: { pv1: pvState },
  globalMacros: {},
  effectivePvNameMap: { pv1: "pv1", pv2: "pv3" },
  subscriptions: {},
  deviceCache: {},
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
