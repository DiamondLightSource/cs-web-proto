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

abstract class SimPv {
  protected onConnectionUpdate: ConnectionChangedCallback;
  protected onValueUpdate: ValueChangedCallback;
  protected pvName: string;
  protected updateRate: number;
  abstract getValue(): VType;
  public constructor(
    pvName: string,
    onConnectionUpdate: ConnectionChangedCallback,
    onValueUpdate: ValueChangedCallback,
    updateRate: number
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
}

class SinePv extends SimPv {
  public constructor(
    pvName: string,
    onConnectionUpdate: ConnectionChangedCallback,
    onValueUpdate: ValueChangedCallback,
    updateRate: number
  ) {
    super(pvName, onConnectionUpdate, onValueUpdate, updateRate);
    setInterval(
      (): void =>
        this.onValueUpdate(this.pvName, { value: this.getValue().getValue() }),
      this.updateRate
    );
  }
  public getValue(): VType {
    const val = Math.sin(
      new Date().getSeconds() + new Date().getMilliseconds() * 0.001
    );
    return vdouble(val);
  }
}

class Disconnector extends SimPv {
  public constructor(
    pvName: string,
    onConnectionUpdate: ConnectionChangedCallback,
    onValueUpdate: ValueChangedCallback,
    updateRate: number
  ) {
    super(pvName, onConnectionUpdate, onValueUpdate, updateRate);
    this.onValueUpdate(this.pvName, { value: this.getValue().getValue() });
    setInterval(
      (): void => this.onConnectionUpdate(this.pvName, this.getConnection()),
      this.updateRate
    );
  }
  public getConnection(): ConnectionState {
    const randomBool = Math.random() >= 0.5;
    return { isConnected: randomBool };
  }

  public getValue(): VType {
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
    this.onValueUpdate(this.pvName, { value: this.getValue() });
    setInterval(
      (): void => this.onValueUpdate(this.pvName, { value: this.getValue() }),
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
    this.onValueUpdate(this.pvName, { value: this.getValue() });
    setInterval(
      (): void => this.onValueUpdate(this.pvName, { value: this.getValue() }),
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

class MetaData extends SimPv {
  private value: VType;
  // Class to provide PV value along with Alarm and Timestamp data
  // Initial limits will be 10, 20, 80 and 90 - with expected range between 0 and 100
  public constructor(
    pvName: string,
    onConnectionUpdate: ConnectionChangedCallback,
    onValueUpdate: ValueChangedCallback,
    updateRate: number
  ) {
    super(pvName, onConnectionUpdate, onValueUpdate, updateRate);
    this.value = vdouble(50);
    this.onValueUpdate(this.pvName, { value: this.getValue().getValue() });
    setInterval(
      (): void => this.onConnectionUpdate(this.pvName, this.getConnection()),
      this.updateRate
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

interface ValueCache {
  [pvName: string]: VType;
}

interface MetaCache {
  [pvName: string]: MetaData;
}

interface EnumCache {
  [pvName: string]: EnumPv;
}

export class SimulatorPlugin implements Connection {
  private localPvs: ValueCache;
  private simPvs: SimCache;
  private metaPvs: MetaCache;
  private enumPvs: EnumCache;
  private onConnectionUpdate: ConnectionChangedCallback;
  private onValueUpdate: ValueChangedCallback;

  public constructor() {
    this.simPvs = {};
    this.localPvs = {};
    this.metaPvs = {};
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

  public subscribe(pvName: string): void {
    log.debug(`Subscribing to ${pvName}.`);
    if (pvName.startsWith("loc://")) {
      this.localPvs[pvName] = vdouble(0);
      this.onConnectionUpdate(pvName, { isConnected: true });
      this.onValueUpdate(pvName, { value: vdouble(0) });
    } else if (pvName === "sim://disconnector") {
      this.simPvs[pvName] = new Disconnector(
        "sim://disconnector",
        this.onConnectionUpdate,
        this.onValueUpdate,
        2000
      );
    } else if (pvName === "sim://sine") {
      this.simPvs[pvName] = new SinePv(
        "sim://sine",
        this.onConnectionUpdate,
        this.onValueUpdate,
        2000
      );
    } else if (pvName === "sim://enum") {
      this.simPvs[pvName] = new SimEnumPv(
        "sim://enum",
        this.onConnectionUpdate,
        this.onValueUpdate,
        2000
      );
    } else if (pvName.startsWith("meta://")) {
      if (Array.from(Object.keys(this.metaPvs)).indexOf(pvName) < 0) {
        this.metaPvs[pvName] = new MetaData(
          pvName,
          this.onConnectionUpdate,
          this.onValueUpdate,
          2000
        );
      }
    } else if (pvName.startsWith("enum://")) {
      if (Array.from(Object.keys(this.enumPvs)).indexOf(pvName) < 0) {
        this.enumPvs[pvName] = new EnumPv(
          pvName,
          this.onConnectionUpdate,
          this.onValueUpdate,
          2000
        );
      }
    }
  }

  public putPv(pvName: string, value: VType): void {
    if (pvName.startsWith("loc://")) {
      this.localPvs[pvName] = value;
      this.onValueUpdate(pvName, { value: value.getValue() });
    } else if (pvName.startsWith("meta://")) {
      let meta = this.metaPvs[pvName];
      meta.updateValue(value);
      this.onValueUpdate(pvName, { value: meta.getValue().getValue() });
    } else if (pvName.startsWith("enum://")) {
      let enumData = this.enumPvs[pvName];
      enumData.updateValue(value);
      this.onValueUpdate(pvName, { value: enumData.getValue() });
    }
  }

  public unsubscribe(pvName: string): void {
    log.debug(`Unsubscribing from ${pvName}.`);
  }
}
