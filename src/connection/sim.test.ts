import { SimulatorPlugin } from "./sim.ts";
import { VType, vdouble } from "../vtypes/vtypes";
import { mergeVtype, PartialVType } from "../vtypes/merge";
import { nullConnCallback, nullValueCallback } from "./plugin";

let simulator: SimulatorPlugin;
beforeEach((): void => {
  simulator = new SimulatorPlugin();
});

function diffToValue(x: PartialVType): VType {
  return x && mergeVtype(vdouble(0), x);
}

function getValue(pvName: string, callback: Function): void {
  simulator.connect(nullConnCallback, function(updatePvName, value): void {
    if (pvName === updatePvName) {
      callback(diffToValue(value));
    }
  });
}

const assertValue = (
  pvName: string,
  impliedPv: string,
  value: any,
  done
): void => {
  getValue(impliedPv, (updatedValue: VType): void => {
    expect(updatedValue.getValue()).toStrictEqual(value);
    done();
  });
  simulator.subscribe(pvName);
};

it("test local values", (done): void => {
  getValue("loc://location", (value: VType | undefined): void => {
    expect(value.getValue()).toEqual(17);
    done();
  });
  simulator.putPv("loc://location", vdouble(17));
});

it("local values zero initially", (done): void => {
  // "Unless a type selector and initial value are provided, a local value will be of type ‘double’ with initial value of 0." [https://buildmedia.readthedocs.org/media/pdf/phoebus-doc/latest/phoebus-doc.pdf]
  getValue("loc://location", (value: any): void => {
    expect(value.getValue()).toEqual(0.0);
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

it("initial limit values", (done): void => {
  getValue("sim://limit", (value): void => {
    expect(value.getValue()).toBe(50);
    done();
  });
  simulator.subscribe("sim://limit");
});

it("modifying limit values", (done): void => {
  function* repeatedCallback(): void {
    const value1 = yield;
    expect(value1.getValue()).toEqual(50);
    const value2 = yield;
    expect(value2.getValue()).toEqual(17);
    done();
  }
  const iter = repeatedCallback();
  iter.next();
  getValue("sim://limit", (value: VType | undefined): void => {
    iter.next(value);
  });
  simulator.subscribe("sim://limit");
  simulator.putPv("sim://limit", vdouble(17));
});

it("distinguish limit values", (done): void => {
  function* repeatedCallback(): void {
    const update1 = yield;
    expect(update1.name).toEqual("sim://limit#one");
    expect(update1.value.getValue()).toEqual(1);
    const update2 = yield;
    expect(update2.name).toEqual("sim://limit#two");
    expect(update2.value.getValue()).toEqual(2);
    done();
  }
  const iter = repeatedCallback();
  iter.next();

  simulator.connect(nullConnCallback, function(name, value): void {
    iter.next({ name: name, value: diffToValue(value) });
  });

  simulator.putPv("sim://limit#one", vdouble(1));
  simulator.putPv("sim://limit#two", vdouble(2));
});

it("test disconnector", (done): void => {
  let wasConnected = false;
  let wasDisconnected = false;
  simulator = new SimulatorPlugin(50);
  function callback(pvName: string, state: any): void {
    expect(pvName).toBe("sim://disconnector");
    if (state.isConnected) {
      wasConnected = true;
    } else {
      wasDisconnected = true;
    }

    if (wasConnected && wasDisconnected) {
      done();
    }
  }

  simulator.connect(callback, nullValueCallback);
  simulator.subscribe("sim://disconnector");
});

describe("supports local initialisation", (): void => {
  // See phoebus doc 7.3.4
  // https://buildmedia.readthedocs.org/media/pdf/ph
  it("floats", (done): void =>
    assertValue("loc://num(1.2)", "loc://num", 1.2, done));
  it("arrays", (done): void =>
    assertValue("loc://nums(1.2, 1.3)", "loc://nums", [1.2, 1.3], done));
  //it("text", (done): void => assertValue("loc://text(\"hello\")", "hello", done))
  // no string vtype implemented
  it("long", (done): void =>
    assertValue("loc://long<Long>(1.8)", "loc://long", 1.8, done));
  it("enums", (done): void =>
    assertValue(
      'loc://options<VEnum>(2, "A", "Initial", "B", "C")',
      "loc://options",
      "Initial",
      done
    ));
  it("named enums", (done): void =>
    assertValue(
      'loc://options#test<VEnum>(2, "A", "Initial", "B", "C")',
      "loc://options#test",
      "Initial",
      done
    ));
});

it("distinguish sine values", (done): void => {
  let oneUpdated = false;
  let twoUpdated = false;
  function callback(update): void {
    if (update.name == "sim://sine#one") {
      oneUpdated = true;
    }

    if (update.name == "sim://sine#two") {
      twoUpdated = true;
    }

    expect(update.value.getValue()).toBeLessThan(1.1);
    expect(update.value.getValue()).toBeGreaterThan(-1.1);

    if (oneUpdated && twoUpdated) {
      done();
    }
  }

  simulator.connect(nullConnCallback, function(name, value): void {
    callback({ name: name, value: diffToValue(value) });
  });

  simulator.subscribe("sim://sine#one", vdouble(1));
  simulator.subscribe("sim://sine#two", vdouble(2));
});

it("return undefined for bad pvs", (): void => {
  getValue("bad pv", (value: VType | undefined): void => {
    expect(value).toBe(undefined);
  });
  simulator.subscribe("bad pv");
});

it("test sine values ", (): void => {
  expect((): void => simulator.putPv("sim://sine", 17)).toThrow(
    new Error("Cannot set value on sine")
  );
});
