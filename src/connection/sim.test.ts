import { SimulatorPlugin } from "./sim.ts";
import { VType, vdouble, VNumber } from "../vtypes/vtypes";

let simulator: SimulatorPlugin;
beforeEach((): void => {
  simulator = new SimulatorPlugin();
});

it("test local values", (): void => {
  simulator.putPv("loc://location", vdouble(17));
  let value = simulator.getValue("loc://location");
  expect(value.getValue()).toEqual(17);
});

it("local values undefined if not set", (): void => {
  expect(simulator.getValue("loc://location")).toEqual(undefined);
});

it("test random values ", (): void => {
    expect(simulator.getValue("sim://random").getValue())
});

it("test enum values ", (): void => {
  expect(simulator.getValue("sim://random"));
});

it("test illegal names", (): void => {
  expect(simulator.getValue("sim://sineillegalname", 17)).toBe(undefined);
});

it("test enum", (): void => {
  expect(simulator.getValue("sim://sineillegalname", 17)).toBe(undefined);
});


it("initial limit values", (): void => {
  expect(simulator.getValue("sim://limit").value).toBe(50);
});

it("modifying limit values", (): void => {
  simulator.putPv("sim://limit", vdouble(17));
  let value = simulator.getValue("sim://limit");
  expect(value.getValue()).toEqual(17);
});


it("disambiguating limit values", (): void => {
  simulator.putPv("sim://limit#one", vdouble(1));
  simulator.putPv("sim://limit#two", vdouble(2));
  let value1 = simulator.getValue("sim://limit#one");
  let value2 = simulator.getValue("sim://limit#two");
  expect(value1.getValue()).toEqual(1);
  expect(value2.getValue()).toEqual(2);
});

it("return undefined for bad pvs", (): void => {
  expect(simulator.getValue("bad pv")).toEqual(undefined)
});

it("test sine values ", (): void => {
  expect(() => simulator.putPv("sim://sine", 17)).toThrow(new Error("Cannot set value on sine"));
});
