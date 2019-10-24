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
import { vtypeInfo, PartialVType } from "../vtypes/merge";

function partialise(value: VType | undefined): PartialVType | undefined {
  if (value === undefined) {
    return undefined;
  } else {
    return vtypeInfo(value, {});
  }
}

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
    this.onConnectionUpdate(pvName, { isConnected: true, isReadonly: true });
  }

  public getConnection(): ConnectionState {
    return { isConnected: true, isReadonly: true };
  }

  public publish(): void {
    this.onValueUpdate(this.pvName, partialise(this.getValue()));
  }

  public updateValue(value: VType): void {
    throw new Error(`Cannot set value on ${this.simulatorName()}`);
  }

  protected maybeSetInterval(callback: () => void): void {
    if (this.updateRate !== undefined) {
      setInterval((): void => {
        callback();
      }, this.updateRate);
    }
  }
}

class SinePv extends SimPv {
  public simulatorName(): string {
    return "sine";
  }

  public constructor(
    pvName: string,
    onConnectionUpdate: ConnectionChangedCallback,
    onValueUpdate: ValueChangedCallback,
    updateRate?: number
  ) {
    super(pvName, onConnectionUpdate, onValueUpdate, updateRate);
    setInterval((): void => {
      const value = this.getValue();
      this.onValueUpdate(this.pvName, partialise(value));
    }, this.updateRate);
  }

  public getValue(): VType | undefined {
    const val = Math.sin(
      new Date().getSeconds() + new Date().getMilliseconds() * 0.001
    );
    return vdouble(val);
  }
}

class RandomPv extends SimPv {
  public simulatorName(): string {
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
      this.onValueUpdate(this.pvName, partialise(this.getValue()));
    });
  }
  public getValue(): VType | undefined {
    return vdouble(Math.random());
  }
}

class Disconnector extends SimPv {
  public simulatorName(): string {
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
    this.onValueUpdate(this.pvName, partialise(value));
    this.maybeSetInterval((): void =>
      this.onConnectionUpdate(this.pvName, this.getConnection())
    );
  }
  public getConnection(): ConnectionState {
    const randomBool = Math.random() >= 0.5;
    return { isConnected: randomBool, isReadonly: true };
  }

  public getValue(): VType | undefined {
    return vdouble(Math.random());
  }
}

class SimEnumPv extends SimPv {
  public simulatorName(): string {
    return "simulated enum";
  }
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
    this.onConnectionUpdate(this.pvName, {
      isConnected: true,
      isReadonly: true
    });
    this.onValueUpdate(this.pvName, partialise(this.getValue()));
    setInterval(
      (): void => this.onValueUpdate(this.pvName, partialise(this.getValue())),
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
  public simulatorName(): string {
    return "enumpv";
  }
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
    this.onConnectionUpdate(this.pvName, {
      isConnected: true,
      isReadonly: false
    });
    this.onValueUpdate(this.pvName, partialise(this.getValue()));
    setInterval(
      (): void => this.onValueUpdate(this.pvName, partialise(this.getValue())),
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
  public simulatorName(): string {
    return "loc";
  }

  private value: VType | undefined;
  public constructor(
    pvName: string,
    onConnectionUpdate: ConnectionChangedCallback,
    onValueUpdate: ValueChangedCallback,
    updateRate?: number
  ) {
    super(pvName, onConnectionUpdate, onValueUpdate, updateRate);
    this.onConnectionUpdate(pvName, { isConnected: true, isReadonly: false });
    this.value = undefined;
    this.updateRate = updateRate;
  }

  public getValue(): VType | undefined {
    return this.value;
  }

  public updateValue(value: VType): void {
    this.value = value;
    this.publish();
  }
}

class LimitData extends SimPv {
  public simulatorName(): string {
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
    this.onConnectionUpdate(this.pvName, this.getConnection());
  }

  public getConnection(): ConnectionState {
    return { isConnected: true, isReadonly: false };
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
      this.publish();
    } else {
      throw new Error(`Value (${value}) is not of ValueType`);
    }
  }

  public getValue(): VType {
    return this.value;
  }
}

interface SimCache {
  [pvName: string]: SimPv;
}

export class SimulatorPlugin implements Connection {
  private simPvs: SimCache;
  private onConnectionUpdate: ConnectionChangedCallback;
  private onValueUpdate: ValueChangedCallback;
  private updateRate: number;
  private connected: boolean;

  public constructor(updateRate?: number) {
    this.simPvs = {};
    this.onConnectionUpdate = nullConnCallback;
    this.onValueUpdate = nullValueCallback;
    this.subscribe = this.subscribe.bind(this);
    this.putPv = this.putPv.bind(this);
    this.updateRate = updateRate || 2000;
    this.connected = false;
  }

  public connect(
    connectionCallback: ConnectionChangedCallback,
    valueCallback: ValueChangedCallback
  ): void {
    if (this.connected) {
      throw new Error("Can only connect once");
    }

    this.onConnectionUpdate = connectionCallback;
    this.onValueUpdate = valueCallback;
    this.connected = true;
  }

  public isConnected(): boolean {
    return this.onConnectionUpdate !== nullConnCallback;
  }

  protected makeSimulator(
    pvName: string,
    onConnectionUpdate: ConnectionChangedCallback,
    onValueUpdate: ValueChangedCallback,
    updateRate: number
  ): SimPv | undefined {
    let cls;

    let parts = pvName.split("#");

    if (pvName.startsWith("loc://")) {
      cls = LocalPv;
    } else if (parts[0] === "sim://disconnector") {
      cls = Disconnector;
    } else if (parts[0] === "sim://sine") {
      cls = SinePv;
    } else if (parts[0] === "sim://enum") {
      cls = SimEnumPv;
    } else if (pvName.startsWith("enum://")) {
      cls = EnumPv;
    } else if (parts[0] === "sim://random") {
      cls = RandomPv;
    } else if (parts[0] === "sim://limit") {
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
    const pvSimulator = (this.simPvs[pvName] =
      this.simPvs[pvName] ||
      this.makeSimulator(
        pvName,
        this.onConnectionUpdate,
        this.onValueUpdate,
        this.updateRate
      ));

    if (pvSimulator !== undefined) {
      pvSimulator.publish();
    }
  }

  public putPv(pvName: string, value: VType): void {
    const pvSimulator = (this.simPvs[pvName] ||
      this.makeSimulator(
        pvName,
        this.onConnectionUpdate,
        this.onValueUpdate,
        this.updateRate
      )) as SimPv;
    this.simPvs[pvName] = pvSimulator;
    if (pvSimulator !== undefined) {
      pvSimulator.updateValue(value);
    }
  }

  public getValue(pvName: string): VType | undefined {
    let pvData = (this.simPvs[pvName] ||
      this.makeSimulator(
        pvName,
        this.onConnectionUpdate,
        this.onValueUpdate,
        this.updateRate
      )) as SimPv;
    return pvData && pvData.getValue();
  }

  public unsubscribe(pvName: string): void {
    log.debug(`Unsubscribing from ${pvName}.`);
  }
}
