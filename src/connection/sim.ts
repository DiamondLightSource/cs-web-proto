import log from "loglevel";
import {
  Connection,
  ConnectionState,
  ConnectionChangedCallback,
  ValueChangedCallback,
  nullConnCallback,
  nullValueCallback
} from "./plugin";
import {
  VType,
  vdouble,
  vdoubleArray,
  VNumber,
  venum,
  VEnum
} from "../types/vtypes/vtypes";
import { VString } from "../types/vtypes/string";
import {
  alarm,
  ALARM_NONE,
  AlarmSeverity,
  AlarmStatus
} from "../types/vtypes/alarm";
import { timeNow } from "../types/vtypes/time";
import { vtypeInfo, PartialVType } from "../types/vtypes/merge";

function partialise(
  value: VType | undefined,
  type?: string
): PartialVType | undefined {
  if (value === undefined) {
    return undefined;
  } else {
    return vtypeInfo(value, { type: type });
  }
}

type SimArgs = [
  string,
  ConnectionChangedCallback,
  ValueChangedCallback,
  number
];

abstract class SimPv {
  private onConnectionUpdate: ConnectionChangedCallback;
  private onValueUpdate: ValueChangedCallback;
  protected subscribed: boolean;
  public pvName: string;
  protected updateRate?: number;
  abstract getValue(): VType | undefined;
  public type: string | undefined;
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
    this.publishConnection();
    this.subscribed = false;
  }

  public getConnection(): ConnectionState {
    return { isConnected: true, isReadonly: true };
  }

  public subscribe(): void {
    this.subscribed = true;
    this.publish();
  }

  public unsubscribe(): void {
    this.subscribed = false;
  }

  public publish(): void {
    if (this.subscribed) {
      this.onValueUpdate(this.pvName, partialise(this.getValue(), this.type));
    }
  }

  public publishConnection(): void {
    this.onConnectionUpdate(this.pvName, this.getConnection());
  }

  public updateValue(_: VType): void {
    throw new Error(`Cannot set value on ${this.constructor.name}`);
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
  type = "VDouble";
  public constructor(...args: SimArgs) {
    super(...args);
    setInterval(this.publish.bind(this), this.updateRate);
  }

  public getValue(): VType | undefined {
    const val = Math.sin(
      new Date().getSeconds() + new Date().getMilliseconds() * 0.001
    );
    return vdouble(val);
  }
}

class RampPv extends SimPv {
  type = "VDouble";
  // Goes from 0-99 on a loop
  public constructor(...args: SimArgs) {
    super(...args);
    setInterval(this.publish.bind(this), this.updateRate);
  }

  public getValue(): VType | undefined {
    const d = new Date();
    const val =
      (d.getSeconds() % 10) * 10 + Math.floor(d.getMilliseconds() / 100);
    let rampAlarm = ALARM_NONE;
    if (val > 90 || val < 10) {
      rampAlarm = alarm(AlarmSeverity.MAJOR, AlarmStatus.NONE, "");
    } else if (val > 80 || val < 20) {
      rampAlarm = alarm(AlarmSeverity.MINOR, AlarmStatus.NONE, "");
    }
    return vdouble(val, rampAlarm);
  }
}

class RandomPv extends SimPv {
  type = "VDouble";
  public constructor(...args: SimArgs) {
    super(...args);
    this.maybeSetInterval(this.publish.bind(this));
  }
  public getValue(): VType | undefined {
    return vdouble(Math.random());
  }
}

class Disconnector extends SimPv {
  type = "VDouble";
  public constructor(...args: SimArgs) {
    super(...args);
    this.publish();
    this.maybeSetInterval(this.publishConnection.bind(this));
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
  type = "VEnum";
  private value: VEnum = venum(
    0,
    ["one", "two", "three", "four"],
    ALARM_NONE,
    timeNow()
  );
  public constructor(...args: SimArgs) {
    super(...args);
    this.publishConnection();
    this.publish();
    setInterval(this.publish.bind(this), this.updateRate);
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
  type = "VEnum";
  private value: VEnum = venum(
    0,
    ["zero", "one", "two", "three", "four", "five"],
    ALARM_NONE,
    timeNow()
  );

  public constructor(...args: SimArgs) {
    super(...args);
    this.publishConnection();
    setInterval(this.publish.bind(this), this.updateRate);
  }

  public getConnection(): ConnectionState {
    return { isConnected: true, isReadonly: false };
  }

  public updateValue(value: VType): void {
    if (value instanceof VEnum) {
      this.value = value;
    } else if (value instanceof VNumber) {
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
      const valueIndex = this.value
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
    this.publish();
  }

  public getValue(): VType {
    return this.value;
  }
}

class WaveformPV extends SimPv {
  type = "VDoubleArray";
  private topValue = 100;
  private size = 1;
  private newValue: number;
  private wave: [number];
  public constructor(...args: SimArgs) {
    super(...args);
    setInterval(this.publish.bind(this), this.updateRate);
    this.wave = [0];
    for (let count = 1; count < this.size; count++) {
      this.wave.push(count);
    }
    this.newValue = this.size;
  }

  public getValue(): VType | undefined {
    // Get rid of the first element
    this.wave.shift();
    // Put the new number on the end
    this.wave.push(this.newValue);
    // Iterate the new number
    this.newValue++;
    // Reset it when too big
    if (this.newValue >= this.topValue) {
      this.newValue = 0;
    }
    return vdoubleArray(this.wave, [this.size]);
  }
}

class LocalPv extends SimPv {
  type = "VString";
  private value: VType | undefined;
  public constructor(...args: SimArgs) {
    super(...args);
    this.publishConnection();
    this.value = undefined;
  }

  public getConnection(): ConnectionState {
    return { isConnected: true, isReadonly: false };
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
  type = "VDouble";
  private value: VType;
  // Class to provide PV value along with Alarm and Timestamp data
  // Initial limits will be 10, 20, 80 and 90 - with expected range between 0 and 100

  public constructor(...args: SimArgs) {
    super(...args);
    this.value = vdouble(50);
    this.publishConnection();
  }

  public getConnection(): ConnectionState {
    return { isConnected: true, isReadonly: false };
  }

  public updateValue(value: VType): void {
    // Set alarm status
    let alarmSeverity = 0;
    if (value instanceof VNumber) {
      const v = value.getValue();
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

class SimCache {
  private store: { [pvName: string]: SimPv | undefined };
  public constructor() {
    this.store = {};
  }
  public put(simPv: SimPv): void {
    this.store[simPv.pvName] = simPv;
  }
  public get(pvName: string): SimPv | undefined {
    return this.store[pvName];
  }
  public remove(pvName: string): void {
    delete this.store[pvName];
  }
}

export class SimulatorPlugin implements Connection {
  private simPvs: SimCache;
  private onConnectionUpdate: ConnectionChangedCallback;
  private onValueUpdate: ValueChangedCallback;
  private updateRate: number;
  private connected: boolean;

  public constructor(updateRate?: number) {
    this.simPvs = new SimCache();
    this.onConnectionUpdate = nullConnCallback;
    this.onValueUpdate = nullValueCallback;
    this.putPv = this.putPv.bind(this);
    this.updateRate = updateRate || 2000;
    this.connected = false;
  }

  public subscribe(pvName: string): string {
    const simulator = this.initSimulator(pvName);
    if (simulator !== undefined) {
      simulator.subscribe();
    }
    return (simulator && simulator.pvName) || pvName;
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

  protected parseName(
    pvName: string
  ): { initialValue: any; protocol: string; keyName: string } {
    const parts = pvName.split("#");
    let keyName;
    let protocol: string;
    let initial = undefined;
    if (pvName.startsWith("loc://")) {
      const matcher = new RegExp(
        "loc://([^<(]*)(?:<([^>]*)>)?(?:\\(([^)]*)\\))?"
      );
      const groups = matcher.exec(pvName);

      if (groups === null) {
        initial = undefined;
        keyName = pvName;
      } else if (groups[3] !== undefined) {
        const typeName = groups[2];
        initial = JSON.parse("[" + groups[3] + "]");
        keyName = "loc://" + groups[1];

        if (typeName === "VEnum") {
          initial = venum(
            initial[0] - 1,
            initial.slice(1),
            ALARM_NONE,
            timeNow()
          );
        } else if (initial.length === 1) {
          initial = vdouble(initial[0]);
        } else {
          initial = vdoubleArray(initial, initial.length);
        }
      } else {
        initial = undefined;
        keyName = pvName;
      }

      protocol = "loc://";
    } else {
      initial = undefined;
      keyName = pvName;
      protocol = parts[0];
    }
    return { initialValue: initial, protocol: protocol, keyName: keyName };
  }

  protected makeSimulator(
    pvName: string,
    onConnectionUpdate: ConnectionChangedCallback,
    onValueUpdate: ValueChangedCallback,
    updateRate: number
  ): { simulator: SimPv | undefined; initialValue: any } {
    let cls;
    const nameInfo = this.parseName(pvName);
    let initial;

    if (nameInfo.protocol === "loc://") {
      cls = LocalPv;

      if (
        nameInfo.initialValue !== undefined &&
        nameInfo.initialValue instanceof VEnum
      ) {
        cls = EnumPv;
      }
      if (nameInfo.initialValue !== undefined) {
        initial = nameInfo.initialValue;
      } else {
        initial = vdouble(0);
      }
    } else if (nameInfo.protocol === "sim://disconnector") {
      cls = Disconnector;
      initial = undefined;
    } else if (nameInfo.protocol === "sim://sine") {
      cls = SinePv;
      initial = undefined;
    } else if (nameInfo.protocol === "sim://enum") {
      cls = SimEnumPv;
      initial = undefined;
    } else if (nameInfo.protocol === "sim://random") {
      initial = undefined;
      cls = RandomPv;
    } else if (nameInfo.protocol === "sim://limit") {
      initial = undefined;
      cls = LimitData;
    } else if (nameInfo.protocol === "sim://ramp") {
      initial = undefined;
      cls = RampPv;
    } else if (nameInfo.protocol === "sim://waveform") {
      initial = undefined;
      cls = WaveformPV;
    } else {
      return { simulator: undefined, initialValue: undefined };
    }
    const result = new cls(
      nameInfo.keyName,
      onConnectionUpdate,
      onValueUpdate,
      updateRate
    );
    return { simulator: result, initialValue: initial };
  }

  public initSimulator(pvName: string): SimPv | undefined {
    const nameInfo = this.parseName(pvName);

    if (this.simPvs.get(nameInfo.keyName) === undefined) {
      const simulatorInfo = this.makeSimulator(
        pvName,
        this.onConnectionUpdate,
        this.onValueUpdate,
        this.updateRate
      );

      if (simulatorInfo.simulator) {
        this.simPvs.put(simulatorInfo.simulator);
      }

      if (simulatorInfo.initialValue !== undefined) {
        if (simulatorInfo.simulator !== undefined) {
          simulatorInfo.simulator.updateValue(simulatorInfo.initialValue);
        }
      }
    }

    return this.simPvs.get(nameInfo.keyName);
  }

  public putPv(pvName: string, value: VType): void {
    const pvSimulator = this.initSimulator(pvName);
    if (pvSimulator !== undefined) {
      pvSimulator.updateValue(value);
    } else {
      throw new Error(
        `Could not create a simulated process variable for ${pvName}`
      );
    }
  }

  public getValue(pvName: string): VType | undefined {
    const pvSimulator = this.initSimulator(pvName);
    return pvSimulator && pvSimulator.getValue();
  }

  public unsubscribe(pvName: string): void {
    log.info(`Unsubscribing from ${pvName}.`);
    const simulator = this.simPvs.get(pvName);
    if (simulator) {
      if (simulator) {
        simulator.unsubscribe();
      }
    }
  }
}
