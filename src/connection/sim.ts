import {
  Connection,
  ConnectionState,
  ConnectionChangedCallback,
  ValueChangedCallback,
  nullConnCallback,
  nullValueCallback
} from "./plugin";
import { NType } from "../ntypes";

abstract class SimPv {
  protected onConnectionUpdate: ConnectionChangedCallback;
  protected onValueUpdate: ValueChangedCallback;
  protected pvName: string;
  protected updateRate: number;
  abstract getValue(): NType;
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
      (): void => this.onValueUpdate(this.pvName, this.getValue()),
      this.updateRate
    );
  }
  public getValue(): NType {
    const val = Math.sin(
      new Date().getSeconds() + new Date().getMilliseconds() * 0.001
    );
    return { type: "NTScalarDouble", value: val };
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
    this.onValueUpdate(this.pvName, this.getValue());
    setInterval(
      (): void => this.onConnectionUpdate(this.pvName, this.getConnection()),
      this.updateRate
    );
  }
  public getConnection(): ConnectionState {
    const randomBool = Math.random() >= 0.5;
    return { isConnected: randomBool };
  }

  public getValue(): NType {
    const value = Math.random();
    return { type: "NTScalarDouble", value: value };
  }
}

class MetaData extends SimPv {
  private value: NType;
  // Class to provide PV value along with Alarm and Timestamp data
  // Initial limits will be 10, 20, 80 and 90 - with expected range between 0 and 100
  public constructor(
    pvName: string,
    onConnectionUpdate: ConnectionChangedCallback,
    onValueUpdate: ValueChangedCallback,
    updateRate: number
  ) {
    super(pvName, onConnectionUpdate, onValueUpdate, updateRate);
    let currentTime = new Date();
    let seconds = Math.round(currentTime.getTime() / 1000),
      nanoseconds = Math.round(currentTime.getTime() % 1000);
    this.value = {
      type: "NTScalar",
      value: 50,
      alarm: { severity: 0, status: 0, message: "" },
      time: {
        secondsPastEpoch: seconds,
        nanoseconds: nanoseconds,
        userTag: 0
      }
    };
    this.onValueUpdate(this.pvName, this.getValue());
    setInterval(
      (): void => this.onConnectionUpdate(this.pvName, this.getConnection()),
      this.updateRate
    );
  }

  public updateValue(value: NType): void {
    // Set alarm status
    let alarmSeverity =
      value.value < 10
        ? 2
        : value.value > 90
        ? 2
        : value.value < 20
        ? 1
        : value.value > 80
        ? 1
        : 0;

    // Produce timestamp info
    let currentTime = new Date().getTime();
    let seconds = Math.floor(currentTime / 1000);
    let nanoseconds = Math.floor(currentTime % 1000);

    this.value = {
      ...value,
      alarm: {
        severity: alarmSeverity,
        status: 0,
        message: ""
      },
      time: {
        secondsPastEpoch: seconds,
        nanoseconds: nanoseconds,
        userTag: 0
      }
    };
  }

  public getValue(): NType {
    return this.value;
  }
}

interface SimCache {
  [pvName: string]: SimPv;
}

interface ValueCache {
  [pvName: string]: NType;
}

interface MetaCache {
  [pvName: string]: MetaData;
}

export class SimulatorPlugin implements Connection {
  private localPvs: ValueCache;
  private simPvs: SimCache;
  private metaPvs: MetaCache;
  private onConnectionUpdate: ConnectionChangedCallback;
  private onValueUpdate: ValueChangedCallback;

  public constructor() {
    this.simPvs = {};
    this.localPvs = {};
    this.metaPvs = {};
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
    console.log(`creating connection to ${pvName}`); //eslint-disable-line no-console
    if (pvName.startsWith("loc://")) {
      this.localPvs[pvName] = { type: "NTScalarDouble", value: 0 };
      this.onConnectionUpdate(pvName, { isConnected: true });
      this.onValueUpdate(pvName, { type: "NTScalarDouble", value: 0 });
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
    } else if (pvName.startsWith("meta://")) {
      if (Array.from(Object.keys(this.metaPvs)).indexOf(pvName) < 0) {
        this.metaPvs[pvName] = new MetaData(
          pvName,
          this.onConnectionUpdate,
          this.onValueUpdate,
          2000
        );
      }
    }
  }

  public putPv(pvName: string, value: NType): void {
    if (pvName.startsWith("loc://")) {
      this.localPvs[pvName] = value;
      this.onValueUpdate(pvName, value);
    } else if (pvName.startsWith("meta://")) {
      let meta = this.metaPvs[pvName];
      meta.updateValue(value);
      this.onValueUpdate(pvName, meta.getValue());
    }
  }

  public getValue(pvName: string): NType {
    if (pvName.startsWith("loc://")) {
      return this.localPvs[pvName];
    } else if (pvName.startsWith("sim://")) {
      this.simPvs[pvName].getValue();
    } else if (pvName === "sim://random") {
      return { type: "NTScalarDouble", value: Math.random() };
    } else if (pvName.startsWith("meta://")) {
      return this.localPvs[pvName];
    }
    return { type: "NTScalarDouble", value: 0 };
  }
}
