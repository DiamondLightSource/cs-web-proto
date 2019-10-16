import log from "loglevel";
import {
  Connection,
  ConnectionState,
  ConnectionChangedCallback,
  ValueChangedCallback,
  nullConnCallback,
  nullValueCallback
} from "./plugin";
import { VType, vdouble, VNumber, venum, VEnum } from "../vtypes/vtypes";
import { VString } from "../vtypes/string";
import { alarm, ALARM_NONE } from "../vtypes/alarm";
import { timeNow } from "../vtypes/time";
import { mergeVtype, vtypeInfo } from "../vtypes/merge";

abstract class SimPv {
  abstract simulatorName(): string;
  protected onConnectionUpdate: ConnectionChangedCallback;
  protected onValueUpdate: ValueChangedCallback;
  protected pvName: string;
  protected updateRate?: number;
  abstract getValue(): VType | undefined;
  public constructor(
    pvName: string,
    onConnectionUpdate: ConnectionChangedCallback,
    onValueUpdate: ValueChangedCallback,
    updateRate?: number
  ) {
    this.pvName = pvName;
    this.onConnectionUpdate = onConnectionUpdate;
    this.onValueUpdate = onValueUpdate;
    this.updateRate = updateRate;
    this.onConnectionUpdate(pvName, { isConnected: true });
  }

  public getConnection(): ConnectionState {
    return { isConnected: true };
  }

  public updateValue(value: VType): void {
    throw new Error(`Cannot set value on ${this.simulatorName()}`);
  }

  protected maybeSetInterval(callback: () => void): void {
    if (this.updateRate !== undefined) {
      setInterval(
        (): void => this.onConnectionUpdate(this.pvName, this.getConnection()),
        this.updateRate
      );
    }
  }
}

class SinePv extends SimPv {
  simulatorName() {
    return "sine";
  }

  public constructor(
    pvName: string,
    onConnectionUpdate: ConnectionChangedCallback,
    onValueUpdate: ValueChangedCallback,
    updateRate?: number
  ) {
    super(pvName, onConnectionUpdate, onValueUpdate, updateRate);
    setInterval(
      (): void => {
        const value = this.getValue();
        this.onValueUpdate(this.pvName, vtypeInfo(value, {}));
      },
      this.updateRate
    );
  }

  public getValue(): VType | undefined {
    const val = Math.sin(
      new Date().getSeconds() + new Date().getMilliseconds() * 0.001
    );
    return vdouble(val);
  }
}

class RandomPv extends SimPv {
  simulatorName() {
    return "random";
  }

  public constructor(
    pvName: string,
    onConnectionUpdate: ConnectionChangedCallback,
    onValueUpdate: ValueChangedCallback,
    updateRate?: number
  ) {
    super(pvName, onConnectionUpdate, onValueUpdate, updateRate);

    this.maybeSetInterval((): void => {
      const value = this.getValue();
      if (value != undefined) {
        this.onValueUpdate(this.pvName, value);
      }
    });
  }
  public getValue(): VType | undefined {
    return vdouble(Math.random());
  }
}

class Disconnector extends SimPv {
  simulatorName() {
    return "disconnect";
  }


  public constructor(
    pvName: string,
    onConnectionUpdate: ConnectionChangedCallback,
    onValueUpdate: ValueChangedCallback,
    updateRate?: number
  ) {
    super(pvName, onConnectionUpdate, onValueUpdate, updateRate);
    let value = this.getValue();
    if (value !== undefined) {
        this.onValueUpdate(this.pvName, vtypeInfo(value, {}));
    }
    this.maybeSetInterval((): void =>
      this.onConnectionUpdate(this.pvName, this.getConnection())
    );
  }
  public getConnection(): ConnectionState {
  const randomBool = Math.random() >= 0.5;
  return { isConnected: randomBool };
}

  public getValue(): VType | undefined {
  const value = Math.random();
  return vdouble(value);
}
}

class SimEnumPv extends SimPv {
  private value: VEnum = venum(
    0,
    ["one", "two", "three", "four"],
    ALARM_NONE,
    timeNow()
  );
  public constructor(
    pvName: string,
    onConnectionUpdate: ConnectionChangedCallback,
    onValueUpdate: ValueChangedCallback,
    updateRate: number
  ) {
    super(pvName, onConnectionUpdate, onValueUpdate, updateRate);
    this.onConnectionUpdate(this.pvName, { isConnected: true });
    this.onValueUpdate(this.pvName, vtypeInfo(value, {}));
    setInterval(
      (): void => this.onValueUpdate(this.pvName, vtypeInfo(value, {})),
      this.updateRate
    );
  }
  public getValue(): VType {
    const newIndex = Math.floor(
      Math.random() * this.value.getDisplay().getChoices().length
    );
    this.value = venum(
      newIndex,
      this.value.getDisplay().getChoices(),
      ALARM_NONE,
      timeNow()
    );
    return this.value;
  }
}

class EnumPv extends SimPv {
  private value: VEnum = venum(
    0,
    ["zero", "one", "two", "three", "four", "five"],
    ALARM_NONE,
    timeNow()
  );
  public constructor(
    pvName: string,
    onConnectionUpdate: ConnectionChangedCallback,
    onValueUpdate: ValueChangedCallback,
    updateRate: number
  ) {
    super(pvName, onConnectionUpdate, onValueUpdate, updateRate);
    this.onConnectionUpdate(this.pvName, { isConnected: true });
    this.onValueUpdate(this.pvName, vtypeInfo(this.getValue(), {}));
    setInterval(
      (): void => this.onValueUpdate(this.pvName, vtypeInfo(value, {})),
      this.updateRate
    );
  }

  public updateValue(value: VType): void {
    if (value instanceof VNumber) {
      // If it is a number, treat as index
      // Indexes outside the range to be ignored
      if (
        value.getValue() >= 0 &&
        value.getValue() < this.value.getDisplay().getChoices().length
      ) {
        this.value = venum(
          value.getValue(),
          this.value.getDisplay().getChoices(),
          ALARM_NONE,
          timeNow()
        );
      }
    } else if (value instanceof VString) {
      // If a string, see if that string is stored as a value in the enum
      // If it is, change index to index of the string
      // Otherwise ignore
      let valueIndex = this.value
        .getDisplay()
        .getChoices()
        .indexOf(value.getValue());
      if (valueIndex !== -1) {
        this.value = venum(
          valueIndex,
          this.value.getDisplay().getChoices(),
          ALARM_NONE,
          timeNow()
        );
      }
    }
  }

  public getValue(): VType {
    return this.value;
  }
}

class LocalPv extends SimPv {
  simulatorName() {
    return "sine";
  }

  private value: VType | undefined;
  public constructor(
    pvName: string,
    onConnectionUpdate: ConnectionChangedCallback,
    onValueUpdate: ValueChangedCallback,
    updateRate?: number
  ) {
    super(pvName, onConnectionUpdate, onValueUpdate, updateRate);
    this.value = undefined;
    this.updateRate = undefined;
  }

  public getValue(): VType | undefined {
    return this.value;
  }

  public updateValue(value: VType): void {
    this.value = value;
  }
}

class LimitData extends SimPv {
  simulatorName() {
    return "limit";
  }

  private value: VType;
  // Class to provide PV value along with Alarm and Timestamp data
  // Initial limits will be 10, 20, 80 and 90 - with expected range between 0 and 100
  public constructor(
    pvName: string,
    onConnectionUpdate: ConnectionChangedCallback,
    onValueUpdate: ValueChangedCallback,
    updateRate?: number
  ) {
    super(pvName, onConnectionUpdate, onValueUpdate, updateRate);
    this.value = vdouble(50);
    this.onValueUpdate(this.pvName, vtypeInfo(this.getValue()));
    this.maybeSetInterval((): void =>
      this.onConnectionUpdate(this.pvName, this.getConnection())
    );
  }

  public updateValue(value: VType): void {
    // Set alarm status
    let alarmSeverity = 0;
    if (value instanceof VNumber) {
      let v = value.getValue();
      alarmSeverity = v < 10 ? 2 : v > 90 ? 2 : v < 20 ? 1 : v > 80 ? 1 : 0;
      this.value = vdouble(
        value.getValue(),
        alarm(alarmSeverity, 0, ""),
        timeNow()
      );
    }
  }

  public getValue(): VType {
    return this.value;
  }
}

interface SimCache {
  [pvName: string]: SimPv;
}


interface EnumCache {
  [pvName: string]: EnumPv;
}

export class SimulatorPlugin implements Connection {
  private simPvs: SimCache;
  private enumPvs: EnumCache;
  private onConnectionUpdate: ConnectionChangedCallback;
  private onValueUpdate: ValueChangedCallback;

  public constructor() {
    this.simPvs = {};
    this.enumPvs = {};
    this.onConnectionUpdate = nullConnCallback;
    this.onValueUpdate = nullValueCallback;
    this.subscribe = this.subscribe.bind(this);
    this.putPv = this.putPv.bind(this);
  }

  public connect(
    connectionCallback: ConnectionChangedCallback,
    valueCallback: ValueChangedCallback
  ): void {
    this.onConnectionUpdate = connectionCallback;
    this.onValueUpdate = valueCallback;
  }

  public isConnected(): boolean {
    return this.onConnectionUpdate !== nullConnCallback;
  }

  protected addPv(): boolean {
    throw new Error("Not implemented");
  }

  protected subscribePv(): boolean {
    throw new Error("Not implemented");
  }

  protected makeSimulator(
    pvName: string,
    onConnectionUpdate: ConnectionChangedCallback,
    onValueUpdate: ValueChangedCallback,
    updateRate?: number
  ): SimPv | undefined {
    let cls;
    if (pvName.startsWith("loc://")) {
      cls = LocalPv;
    } else if (pvName === "sim://disconnector") {
      cls = Disconnector;
    } else if (pvName === "sim://sine") {
      cls = SinePv;
    } else if (pvName === "sim://enum") {
      cls = SimEnumPv
    } else if (pvName.startsWith("enum://")) {
      cls = EnumPv
    } else if (pvName === "sim://random") {
      cls = RandomPv;
    } else if (pvName === "sim://limit" || pvName.startsWith("sim://limit#")) {
      cls = LimitData;
    } else {
      return undefined;
    }
    const result = new cls(
      pvName,
      onConnectionUpdate,
      onValueUpdate,
      updateRate
    );
    return result;
  }

  public subscribe(pvName: string): void {
    log.debug(`Subscribing to ${pvName}.`);
    this.simPvs[pvName] = this.makeSimulator(
      pvName,
      this.onConnectionUpdate,
      this.onValueUpdate,
      -1
    );
  }

  public putPv(pvName: string, value: VType): void {
    const pvSimulator = (this.simPvs[pvName] ||
      this.makeSimulator(
        pvName,
        nullConnCallback,
        nullValueCallback,
        undefined
      )) as SimPv;
    this.simPvs[pvName] = pvSimulator;
    pvSimulator && pvSimulator.updateValue(value);
  }

  public getValue(pvName: string): VType | undefined {
    let pvData = (this.simPvs[pvName] ||
      this.makeSimulator(
        pvName,
        nullConnCallback,
        nullValueCallback,
        undefined
      )) as SimPv;
    return pvData && pvData.getValue();
  }

  public unsubscribe(pvName: string): void {
    log.debug(`Unsubscribing from ${pvName}.`);
  }
}
