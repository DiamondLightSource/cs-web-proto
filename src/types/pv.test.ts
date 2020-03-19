import { PV } from "./pv";

describe("PV", (): void => {
  it("parses a local PV correctly", (): void => {
    const pv = PV.parse("loc://test", "ca");
    expect(pv).toEqual(new PV("test", "loc"));
  });
});
