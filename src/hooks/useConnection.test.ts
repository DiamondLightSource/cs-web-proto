import { CsState } from "../redux/csState";
import { pvStateSelector, pvStateComparator } from "./useConnection";
import { vdouble } from "../vtypes/vtypes";
import { vstring } from "../vtypes/string";

jest.mock("../hooks/useSubscription", (): object => {
  return {
    useSubscription: (id: string, pvNames: string[]): void => {}
  };
});

describe("pvStateSelector", (): void => {
  it("returns appropriate values if PV not present", (): void => {
    const state: CsState = {
      valueCache: {},
      macroMap: {},
      shortPvNameMap: {},
      subscriptions: {}
    };
    const [shortPvName, connected, readonly, value] = pvStateSelector(
      "not-a-pv",
      state
    );
    expect(shortPvName).toEqual("not-a-pv");
    expect(connected).toEqual(false);
    expect(readonly).toEqual(false);
    expect(value).toBeUndefined();
  });
});

describe("pvStateComparator", (): void => {
  it("returns true when first three values are the same", (): void => {
    expect(pvStateComparator(["test", true, true], ["test", true, true])).toBe(
      true
    );
  });
  it("returns false when the pvName changes", (): void => {
    expect(
      pvStateComparator(["test", true, true], ["different string", true, true])
    ).toBe(false);
  });
  it("returns false when the connected value changes changes", (): void => {
    expect(pvStateComparator(["test", true, true], ["test", false, true])).toBe(
      false
    );
  });
  it("returns false when the readonly value changes changes", (): void => {
    expect(pvStateComparator(["test", true, true], ["test", true, false])).toBe(
      false
    );
  });
  it("returns true when the same VDouble object is passed", (): void => {
    const testPV = vdouble(9.87654);
    expect(
      pvStateComparator(
        ["test", true, true, testPV],
        ["test", true, true, testPV]
      )
    ).toBe(true);
  });
  it("returns true when the same VDouble value is passed", (): void => {
    expect(
      pvStateComparator(
        ["test", true, true, vdouble(5.4321)],
        ["test", true, true, vdouble(5.4321)]
      )
    ).toBe(true);
  });
  it("returns true when the same VString object is passed", (): void => {
    const testPV = vstring("test string");
    expect(
      pvStateComparator(
        ["test", true, true, testPV],
        ["test", true, true, testPV]
      )
    ).toBe(true);
  });
  it("returns true when the same VString value is passed", (): void => {
    expect(
      pvStateComparator(
        ["test", true, true, vstring("This is a test")],
        ["test", true, true, vstring("This is a test")]
      )
    ).toBe(true);
  });
});
