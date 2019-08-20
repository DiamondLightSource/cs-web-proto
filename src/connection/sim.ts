import { Connection, ConnectionCallback } from "./plugin";
import { NType } from "../cs";
import { ValueCache } from "../redux/csState";

export class SimulatorPlugin implements Connection {
  private localPvs: ValueCache;
  private onUpdate: ConnectionCallback;
  private timeout: NodeJS.Timeout | null;

  public constructor() {
    this.localPvs = {};
    this.onUpdate = (_p, _v): void => {};
    this.subscribe = this.subscribe.bind(this);
    this.putPv = this.putPv.bind(this);
    /* Set up the sine PV. */
    this.timeout = null;
  }

  public connect(callback: ConnectionCallback): void {
    this.onUpdate = callback;
    this.timeout = setInterval(
      (): void => this.onUpdate("sim://sine", this.getValue("sim://sine")),
      2000
    );
  }

  public isConnected(): boolean {
    return this.onUpdate != null;
  }

  public subscribe(pvName: string): void {
    console.log(`creating connection to ${pvName}`); //eslint-disable-line no-console
    if (pvName.startsWith("loc://")) {
      this.localPvs[pvName] = { type: "NTScalarDouble", value: 0 };
      this.onUpdate(pvName, { type: "NTScalarDouble", value: 0 });
    }
  }

  public putPv(pvName: string, value: NType): void {
    if (pvName.startsWith("loc://")) {
      this.localPvs[pvName] = value;
      this.onUpdate(pvName, value);
    }
  }

  public getValue(pvName: string): NType {
    if (pvName.startsWith("loc://")) {
      return this.localPvs[pvName];
    } else if (pvName === "sim://sine") {
      const val = Math.sin(
        new Date().getSeconds() + new Date().getMilliseconds() * 0.001
      );
      return { type: "NTScalarDouble", value: val };
    } else if (pvName === "sim://random") {
      return { type: "NTScalarDouble", value: Math.random() };
    } else {
      return { type: "NTScalarDouble", value: 0 };
    }
  }
}
