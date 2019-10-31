import { SimulatorPlugin } from "./sim";
import { VType, vdouble, VDouble, VEnum } from "../vtypes/vtypes";
import { mergeVtype, PartialVType } from "../vtypes/merge";
import { nullConnCallback, nullValueCallback } from "./plugin";

let simulator: SimulatorPlugin;
beforeEach((): void => {
  simulator = new SimulatorPlugin();
});

// Some ugly TypeScript here.
function diffToValue(x: PartialVType | VType | undefined): VType {
  if (typeof x === undefined) {
    return vdouble(0);
  } else if (x instanceof VType) {
    return x;
  } else {
    return mergeVtype(vdouble(0), x as PartialVType) as VType;
  }
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
  done: jest.DoneCallback
): void => {
  getValue(impliedPv, (updatedValue: VType): void => {
    expect(updatedValue.getValue()).toStrictEqual(value);
    done();
  });
  simulator.subscribe(pvName);
};

it("test local values", (done): void => {
  var zeroDone = false;
  getValue("loc://location", (value: VType): void => {
    if (!zeroDone) {
      expect(value.getValue()).toEqual(0.0);
      zeroDone = true;
    } else {
      expect(value.getValue()).toEqual(17.0);
    }
    done();
  });
  simulator.subscribe("loc://location");
  simulator.putPv("loc://location", vdouble(17));
});

it("test enum values blocked", (): void => {
  expect((): void => {
    simulator.putPv("enum://name", vdouble(1));
  }).toThrow();
});

it("local values zero initially", (done): void => {
  // "Unless a type selector and initial value are provided, a local value will be of type ‘double’ with initial value of 0." [https://buildmedia.readthedocs.org/media/pdf/phoebus-doc/latest/phoebus-doc.pdf]
  getValue("loc://location", (value: any): void => {
    expect(value.getValue()).toEqual(0.0);
    done();
  });
  simulator.subscribe("loc://location");
});

it("doesn't delete pv on unsubscribe", (): void => {
  expect(simulator["simPvs"].get("loc://location")).toBe(undefined);
  simulator.subscribe("loc://location");
  expect(simulator["simPvs"].get("loc://location")).toBeTruthy();
  simulator.unsubscribe("loc://location");
  expect(simulator["simPvs"].get("loc://location")).toBeTruthy();
});

it("test random values ", (): void => {
  getValue("sim://random", (value: VType): void => {
    expect(value.getValue());
  });
  simulator.subscribe("sim://random");
});

it("test illegal names", (): void => {
  expect(simulator.getValue("sim://sineillegalname")).toBe(undefined);
});

it("test enum", (): void => {
  getValue("sim://enum", (value: VEnum): void => {
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
  getValue("sim://limit", (value: VDouble): void => {
    expect(value.getValue()).toBe(50);
    done();
  });
  simulator.subscribe("sim://limit");
});

it("modifying limit values", (done): void => {
  function* repeatedCallback(): any {
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

it("distinguishes limit values", (done): void => {
  function* repeatedCallback(): any {
    const update1 = yield;
    expect(update1.name).toEqual("sim://limit#one");
    expect(update1.value.getValue()).toEqual(50);

    const update2 = yield;
    expect(update2.name).toEqual("sim://limit#two");
    expect(update2.value.getValue()).toEqual(50);

    const update3 = yield;
    expect(update3.name).toEqual("sim://limit#one");
    expect(update3.value.getValue()).toEqual(1);
    const update4 = yield;
    expect(update4.name).toEqual("sim://limit#two");
    expect(update4.value.getValue()).toEqual(2);
    done();
  }
  const iter = repeatedCallback();
  iter.next();

  simulator.connect(nullConnCallback, function(name, value): void {
    iter.next({ name: name, value: diffToValue(value) });
  });

  simulator.subscribe("sim://limit#one");
  simulator.subscribe("sim://limit#two");
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
  function callback(update: any): void {
    if (update.name === "sim://sine#one") {
      oneUpdated = true;
    }

    if (update.name === "sim://sine#two") {
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

  simulator.subscribe("sim://sine#one");
  simulator.subscribe("sim://sine#two");
});

it("return undefined for bad pvs", (): void => {
  getValue("bad pv", (value: VType | undefined): void => {
    expect(value).toBe(undefined);
  });
  simulator.subscribe("bad pv");
});


class ConnectionClient {
  public expectedValue: VType;
  public subscribed: boolean;
  private simulator: SimulatorPlugin;
  private key: string | undefined;

  public constructor(simulator: SimulatorPlugin, key?: string) {
    this.expectedValue = vdouble(0.0);
    this.subscribed = false;
    this.simulator = simulator;
    this.key = key;
  }

  public subscribe(key?: string): void {
    this.subscribed = true;
    simulator.subscribe(this.key);
  }

  public unsubscribe(key?: string): void {
    this.subscribed = false;
    simulator.unsubscribe(this.key);
  }

  public putPv(value: number, key?: string): void {
    this.expectedValue = vdouble(value);
    simulator.putPv(this.key, vdouble(value));
  }

  public callback(callback: Function): Function {
    return function(name: string, value: PartialVType) {
      return callback({ name: name, value: diffToValue(value) });
    }
  }
}


class StageFinished extends Error {
  public constructor(name: string) {
    super(name);
  }
}

class StagedCallbacks {
  private doneStages: string[];
  public constructor() {
    this.doneStages = [];
  }
  public stage(name: string, f: Function, ...args: any[]): void {
    if (this.doneStages.indexOf(name) === -1) {
      this.doneStages.push(name);
      f(...args);
      throw new StageFinished(name);
    }
  }

  public callback(callback: Function) {
    return function(...args: any[]) {
      try {
        return callback(...args);
      } catch (e) {
        if (e instanceof StageFinished) {
          return;
        } else {
          throw e;
        }
      }
    }
  }
}


it("unsubscribe stops updates for simulated values", (done): void => {
  var callbacks = new StagedCallbacks();
  simulator = new SimulatorPlugin(50);
  var client = new ConnectionClient(simulator, "sim://sine");


  const callback = (data: { value: VType; name: string }): void => {
    if (client.subscribed) {
      callbacks.stage("one", () => { });
      callbacks.stage("two", () => { client.unsubscribe(); setTimeout(function() { done() }, 2000) });
    } else {
      done.fail("Received updates after unsubscribe.");
      client.subscribe();
    }
  };

  simulator.connect(nullConnCallback, callbacks.callback(client.callback(callback)));
  client.subscribe();
});


it("unsubscribe stops updates, but maintains value", (done): void => {
  var callbacks = new StagedCallbacks();
  var client = new ConnectionClient(simulator);

  const callback = (data: { value: VType; name: string }): void => {
    if (client.subscribed) {

      expect(data.value.getValue()).toBe(client.expectedValue.getValue());
      callbacks.stage("zero", (): void => {
        client.putPv(2.0);
      });

      callbacks.stage("one", (): void => {
        client.unsubscribe();
        client.putPv(3.0);
        setTimeout(function(): void {
          client.subscribe();
          client.putPv(4.0);
        }, 100);
      });
      callbacks.stage("two", (): void => {
        done();
      });
    } else {
      done.fail("Received updates after unsubscribe.");
    }
  };

  simulator.connect(nullConnCallback, callbacks.callback(client.callback(callback)));
  client.subscribe();
});

it("test sine values ", (): void => {
  expect((): void => simulator.putPv("sim://sine", vdouble(17))).toThrow(
    new Error("Cannot set value on SinePv")
  );
});
