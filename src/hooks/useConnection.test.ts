import { CsState } from "../redux/csState";
import { pvStateSelector } from "./useConnection";

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
