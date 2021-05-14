import { SimulatorPlugin } from "./sim";
import {
  nullConnCallback,
  nullValueCallback,
  ValueChangedCallback
} from "./plugin";
import { ddouble, dstring } from "../testResources";
import { DType } from "../types/dtypes";

let simulator: SimulatorPlugin;
beforeEach((): void => {
  simulator = new SimulatorPlugin();
});

function getValue(pvName: string, callback: (value: DType) => void): void {
  simulator.connect(nullConnCallback, function (updatePvName, value): void {
    const nameInfo1 = SimulatorPlugin.parseName(updatePvName);
    const nameInfo2 = SimulatorPlugin.parseName(updatePvName);
    if (nameInfo1.keyName === nameInfo2.keyName) {
      callback(value);
    }
  });
}

const assertValue = (
  pvName: string,
  impliedPv: string,
  value: any,
  done: jest.DoneCallback
): void => {
  getValue(impliedPv, (updatedValue: DType): void => {
    if (!isNaN(DType.coerceDouble(updatedValue))) {
      expect(updatedValue.getDoubleValue()).toStrictEqual(value);
    } else if (updatedValue.getArrayValue() !== undefined) {
      expect(updatedValue.getArrayValue()).toStrictEqual(value);
    } else {
      expect(updatedValue.getStringValue()).toStrictEqual(value);
    }
    done();
  });
  simulator.subscribe(pvName);
};

test("local double updates", (done): void => {
  let zeroDone = false;
  getValue("loc://location", (value: DType): void => {
    if (!zeroDone) {
      expect(value.getDoubleValue()).toEqual(0.0);
      zeroDone = true;
    } else {
      expect(value.getDoubleValue()).toEqual(17.0);
    }
    done();
  });
  simulator.subscribe("loc://location");
  simulator.putPv("loc://location", ddouble(17));
});
test("local enum updates", (done): void => {
  let zeroDone = false;
  getValue("loc://enum", (value: DType): void => {
    if (!zeroDone) {
      expect(value.getDoubleValue()).toEqual(1.0);
      expect(value.getStringValue()).toEqual("deux");
      zeroDone = true;
    } else {
      expect(value.getDoubleValue()).toEqual(0.0);
      expect(value.getStringValue()).toEqual("un");
    }
    done();
  });
  simulator.subscribe('loc://enum<VEnum>(2, "un", "deux", "trois")');
  simulator.putPv("loc://enum", ddouble(0));
});

test("local enum updates from string", (done): void => {
  let zeroDone = false;
  getValue("loc://enum", (value: DType): void => {
    if (!zeroDone) {
      expect(value.getDoubleValue()).toEqual(1.0);
      expect(value.getStringValue()).toEqual("deux");
      zeroDone = true;
    } else {
      expect(value.getDoubleValue()).toEqual(0.0);
      expect(value.getStringValue()).toEqual("un");
    }
    done();
  });
  simulator.subscribe('loc://enum<VEnum>(2, "un", "deux", "trois")');
  simulator.putPv("loc://enum", dstring("un"));
});

it("test enum values blocked", (): void => {
  expect((): void => {
    simulator.putPv("enum://name", ddouble(1));
  }).toThrow();
});

it("local values zero initially", (done): void => {
  // "Unless a type selector and initial value are provided, a local value will be of type ‘double’ with initial value of 0." [https://buildmedia.readthedocs.org/media/pdf/phoebus-doc/latest/phoebus-doc.pdf]
  getValue("loc://location", (value: DType): void => {
    expect(value.getDoubleValue()).toEqual(0.0);
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
  getValue("sim://random", (value: DType): void => {
    expect(value.getDoubleValue());
  });
  simulator.subscribe("sim://random");
});

it("test illegal names", (): void => {
  expect(simulator.getValue("sim://sineillegalname")).toBe(undefined);
});

it("test enum", (): void => {
  getValue("sim://enum", (value: DType): void => {
    expect(
      ["one", "two", "three", "four"].indexOf(DType.coerceString(value))
    ).toBeGreaterThan(-1);
    expect(
      (value.display?.choices as string[])[DType.coerceDouble(value)]
    ).toBe(value.getStringValue());
  });
  simulator.subscribe("sim://enum");
});

it("test receive updates", (done): void => {
  const values = [];
  simulator = new SimulatorPlugin();
  // Ramp PV updates every 100ms; expect three updates
  // by 250ms.
  setTimeout((): void => {
    expect(values.length).toEqual(3);
    done();
  }, 250);
  getValue("sim://ramp", (value: DType): void => {
    values.push(value);
  });
  simulator.subscribe("sim://ramp");
});

describe("LimitData", (): void => {
  test("initial limit values", (done): void => {
    getValue("sim://limit", (value: DType): void => {
      expect(value.getDoubleValue()).toBe(50);
      done();
    });
    simulator.subscribe("sim://limit");
  });

  test("set double to limit PV", (done): void => {
    function* repeatedCallback(): any {
      const value1 = yield;
      expect(value1.getDoubleValue()).toEqual(50);
      const value2 = yield;
      expect(value2.getDoubleValue()).toEqual(17);
      done();
    }
    const iter = repeatedCallback();
    iter.next();
    getValue("sim://limit", (value: DType | undefined): void => {
      iter.next(value);
    });
    simulator.subscribe("sim://limit");
    simulator.putPv("sim://limit", ddouble(17));
  });

  test("set string to limit PV", (done): void => {
    function* repeatedCallback(): any {
      const value1 = yield;
      expect(value1.getDoubleValue()).toEqual(50);
      const value2 = yield;
      expect(value2.getDoubleValue()).toEqual(89);
      done();
    }
    const iter = repeatedCallback();
    iter.next();
    getValue("sim://limit", (value: DType | undefined): void => {
      iter.next(value);
    });
    simulator.subscribe("sim://limit");
    simulator.putPv("sim://limit", dstring("89"));
  });

  it("distinguishes limit values", (done): void => {
    function* repeatedCallback(): any {
      const update1 = yield;
      expect(update1.name).toEqual("sim://limit#one");
      expect(update1.value.getDoubleValue()).toEqual(50);

      const update2 = yield;
      expect(update2.name).toEqual("sim://limit#two");
      expect(update2.value.getDoubleValue()).toEqual(50);

      const update3 = yield;
      expect(update3.name).toEqual("sim://limit#one");
      expect(update3.value.getDoubleValue()).toEqual(1);
      const update4 = yield;
      expect(update4.name).toEqual("sim://limit#two");
      expect(update4.value.getDoubleValue()).toEqual(2);
      done();
    }
    const iter = repeatedCallback();
    iter.next();

    simulator.connect(nullConnCallback, function (name, value): void {
      iter.next({ name: name, value: value });
    });

    simulator.subscribe("sim://limit#one");
    simulator.subscribe("sim://limit#two");
    simulator.putPv("sim://limit#one", ddouble(1));
    simulator.putPv("sim://limit#two", ddouble(2));
  });
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
      1,
      done
    ));
  it("named enums", (done): void =>
    assertValue(
      'loc://options#test<VEnum>(2, "A", "Initial", "B", "C")',
      "loc://options#test",
      1,
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

    expect(update.value.getDoubleValue()).toBeLessThan(1.1);
    expect(update.value.getDoubleValue()).toBeGreaterThan(-1.1);

    if (oneUpdated && twoUpdated) {
      done();
    }
  }

  simulator.connect(nullConnCallback, function (name, value): void {
    callback({ name: name, value: value });
  });

  simulator.subscribe("sim://sine#one");
  simulator.subscribe("sim://sine#two");
});

it("return undefined for bad pvs", (): void => {
  getValue("bad pv", (value: DType | undefined): void => {
    expect(value).toBe(undefined);
  });
  simulator.subscribe("bad pv");
});

type dataCallback = (data: { name: string; value: DType }) => void;

class ConnectionClient {
  public expectedValue: DType;
  public subscribed: boolean;
  private simulator: SimulatorPlugin;
  private key: string | undefined;

  public constructor(simulator: SimulatorPlugin, key?: string) {
    this.expectedValue = ddouble(0.0);
    this.subscribed = false;
    this.simulator = simulator;
    this.key = key;
  }

  private _key(key?: string): string {
    key = key || this.key;
    if (key === undefined) {
      throw new Error("No key");
    }
    return key;
  }

  public subscribe(key?: string): void {
    this.subscribed = true;
    this.simulator.subscribe(this._key(key));
  }

  public unsubscribe(key?: string): void {
    this.subscribed = false;
    this.simulator.unsubscribe(this._key(key));
  }

  public putPv(value: number, key?: string): void {
    this.expectedValue = ddouble(value);
    this.simulator.putPv(this._key(key), ddouble(value));
  }

  public callback(
    callback: dataCallback
  ): (name: string, value: DType) => void {
    return function (name: string, value: DType): void {
      return callback({ name: name, value: value });
    };
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
  public stage(name: string, f: () => void): void {
    if (this.doneStages.indexOf(name) === -1) {
      this.doneStages.push(name);
      f();
      throw new StageFinished(name);
    }
  }

  public callback(callback: ValueChangedCallback): ValueChangedCallback {
    return function (name: string, value: DType): void {
      try {
        return callback(name, value);
      } catch (e) {
        if (e instanceof StageFinished) {
          return;
        } else {
          throw e;
        }
      }
    };
  }
}

it("unsubscribe stops updates for simulated values", (done): void => {
  const callbacks = new StagedCallbacks();
  simulator = new SimulatorPlugin(50);
  const client = new ConnectionClient(simulator, "sim://sine");

  const callback = (data: { value: DType; name: string }): void => {
    if (client.subscribed) {
      callbacks.stage("one", (): void => {});
      callbacks.stage("two", (): void => {
        client.unsubscribe();
        setTimeout(done, 2000);
      });
    } else {
      done.fail("Received updates after unsubscribe.");
      client.subscribe();
    }
  };

  simulator.connect(
    nullConnCallback,
    callbacks.callback(client.callback(callback))
  );
  client.subscribe();
});

it("unsubscribe stops updates, but maintains value", (done): void => {
  const callbacks = new StagedCallbacks();
  const client = new ConnectionClient(simulator, "loc://name");

  const callback = (data: { value: DType; name: string }): void => {
    if (client.subscribed) {
      expect(data.value.getDoubleValue()).toBe(
        client.expectedValue.getDoubleValue()
      );
      callbacks.stage("zero", (): void => {
        client.putPv(2.0);
      });

      callbacks.stage("one", (): void => {
        client.unsubscribe();
        client.putPv(3.0);
        setTimeout(function (): void {
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

  simulator.connect(
    nullConnCallback,
    callbacks.callback(client.callback(callback))
  );
  client.subscribe();
});

it("test sine values ", (): void => {
  expect((): void => simulator.putPv("sim://sine", ddouble(17))).toThrow(
    new Error("Cannot set value on SinePv")
  );
});
