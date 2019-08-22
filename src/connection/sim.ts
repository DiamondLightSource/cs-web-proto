import {
  Connection,
  ConnectionChangedCallback,
  ValueChangedCallback,
  nullConnCallback,
  nullValueCallback
} from "./plugin";
import { NType } from "../ntypes";
import { ValueCache } from "../redux/csState";
import { ConnectionState } from "../redux/connectionMiddleware";

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

interface SimCache {
  [pvName: string]: SimPv;
}

export class SimulatorPlugin implements Connection {
  private localPvs: ValueCache;
  private simPvs: SimCache;
  private onConnectionUpdate: ConnectionChangedCallback;
  private onValueUpdate: ValueChangedCallback;

  public constructor() {
    this.simPvs = {};
    this.localPvs = {};
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
    }
  }

  public putPv(pvName: string, value: NType): void {
    if (pvName.startsWith("loc://")) {
      this.localPvs[pvName] = value;
      this.onValueUpdate(pvName, value);
    }
  }

  public getValue(pvName: string): NType {
    if (pvName.startsWith("loc://")) {
      return this.localPvs[pvName];
    } else if (pvName.startsWith("sim://")) {
      this.simPvs[pvName].getValue();
    } else if (pvName === "sim://random") {
      return { type: "NTScalarDouble", value: Math.random() };
    }
    return { type: "NTScalarDouble", value: 0 };
  }
}
