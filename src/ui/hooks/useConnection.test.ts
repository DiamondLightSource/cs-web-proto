import { useSelector } from "react-redux";
import { useConnection } from "./useConnection";
import { ddouble } from "../../setupTests";

const TEST_VAL = ddouble(2);

// Mock useSubscription.
jest.mock("./useSubscription", (): object => {
  return {
    useSubscription: jest.fn()
  };
});
// Mock useSelector.
jest.mock("react-redux", (): object => {
  return {
    useSelector: jest.fn()
  };
});
// This has to be done in a second step because Jest does the
// mocking before we have access to other imports (vdouble).
(useSelector as jest.Mock).mockImplementation((pvName: string): any => {
  return {
    PV1: [{ value: TEST_VAL, connected: true, readonly: false }, "PV1"]
  };
});

describe("useConnection", (): void => {
  it("returns null values if pvName undefined", (): void => {
    const [epn, connected, readonly, value] = useConnection("id1", undefined);
    expect(epn).toEqual("undefined");
    expect(connected).toEqual(false);
    expect(readonly).toEqual(false);
    expect(value).toEqual(undefined);
  });
  it("returns valid values if pvName returns data", (): void => {
    const [epn, connected, readonly, value] = useConnection("id1", "PV1");
    expect(epn).toEqual("PV1");
    expect(connected).toEqual(true);
    expect(readonly).toEqual(false);
    expect(value).toEqual(TEST_VAL);
  });
});
