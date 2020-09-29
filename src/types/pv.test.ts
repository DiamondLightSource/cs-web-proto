import { PV } from "./pv";

describe("PV", (): void => {
  it("parses a local PV correctly", (): void => {
    const pv = PV.parse("loc://test", "ca");
    expect(pv).toEqual(new PV("test", "loc"));
  });
  it("ignores protocol if name contains one", (): void => {
    const pv = new PV("loc://test", "ca");
    expect(pv.qualifiedName()).toEqual("loc://test");
  });
  it("default protocol is applied", (): void => {
    const pv = PV.parse("pvName");
    expect(pv).toEqual(new PV("pvName", "ca"));
  });
});
