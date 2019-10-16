import { SimulatorPlugin } from "./sim.ts";
import { VType, vdouble } from "../vtypes/vtypes";
import { nullConnCallback } from "./plugin";

let simulator: SimulatorPlugin;
beforeEach((): void => {
  simulator = new SimulatorPlugin();
});

function getValue(pvName: string, callback: Function): void {
  simulator.connect(nullConnCallback, function(updatePvName, value): void {
    if (pvName === updatePvName) {
      callback(value);
    }
  });
}

it("test local values", (done): void => {
  getValue("loc://location", (value:VType|undefined): void => {
    expect(value.getValue()).toEqual(17);
    done();
  });
  simulator.putPv("loc://location", vdouble(17));
});

it("local values undefined if not set", (done): void => {
  getValue("loc://location", (value: any): void => {
    expect(value).toEqual(undefined);
    done();
  });
  simulator.subscribe("loc://location");
});

it("test random values ", (): void => {
  getValue("sim://random", (value: VType): void => {
    expect(value.getValue());
  });
  simulator.subscribe("sim://random");
});

it("test illegal names", (): void => {
  expect(simulator.getValue("sim://sineillegalname", 17)).toBe(undefined);
});

it("test enum", (): void => {
  getValue("sim://enum", (value: VType | undefined): void => {
    expect(
      ["one", "two", "three", "four"].indexOf(value.getValue())
    ).toBeGreaterThan(-1);
    expect(value.getDisplay().getChoices()[value.getIndex()]).toBe(
      value.getValue()
    );
  });
  simulator.subscribe("sim://enum");
});

it("test receive updates", (done): void => {
  let values = [];
  simulator = new SimulatorPlugin(50);
  setTimeout((): void => {
    expect(values.length).toBeGreaterThan(15);
    expect(values.length).toBeLessThan(25);
    done();
  }, 1000);
  getValue("sim://sine", (value: VType): void => {
    values.push(value);
  });
  simulator.subscribe("sim://sine");
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
  let testCount = 0;
  getValue("sim://limit#one", (value: VType | undefined): void => {
    testCount++;
    expect(value.getValue()).toEqual(1);
    if (testCount == 2){
      done();
    }
  });
  getValue("sim://limit#two", (value: Vtype): void => {
    testCount++;
    expect(value.getValue()).toEqual(2);
    if (testCount == 2){
      done();
    }
  });
  simulator.putPv("sim://limit#one", vdouble(1));
  simulator.putPv("sim://limit#two", vdouble(2));
});

it("return undefined for bad pvs", (): void => {
  getValue("bad pv", (value: VType | undefined): void => {
    expect(value).toBe(undefined);
  });
  simulator.subscribe("bad pv");
});

it("test sine values ", (): void => {
  expect(() => simulator.putPv("sim://sine", 17)).toThrow(
    new Error("Cannot set value on sine")
  );
});
