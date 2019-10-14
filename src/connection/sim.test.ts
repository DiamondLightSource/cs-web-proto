import { SimulatorPlugin } from "./sim.ts";

let simulator: SimulatorPlugin;
beforeEach((): void => {
  simulator = new SimulatorPlugin();
});

it("test local values", (): void => {
  simulator.putPv("loc://location", 17);
  let value = simulator.getValue("loc://location");
  expect(value).toEqual(17);
});

it("local values undefined if not set", (): void => {
  expect(simulator.getValue("loc://location")).toEqual(undefined);
});

it("test random values ", (): void => {
  expect(simulator.getValue("sim://random"));
});

it("test illegal names", (): void => {
  expect(simulator.getValue("sim://sineillegalname", 17)).toBe(undefined);
});
