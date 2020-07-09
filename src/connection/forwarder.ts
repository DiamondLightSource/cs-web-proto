import {
  Connection,
  ConnectionChangedCallback,
  ValueChangedCallback,
  DeviceQueryCallback,
  SubscriptionType
} from "./plugin";

export class ConnectionForwarder implements Connection {
  private prefixConnections: [string, Connection | undefined][];
  private connected: boolean;
  public constructor(prefixConnections: [string, Connection | undefined][]) {
    this.prefixConnections = prefixConnections;
    this.connected = false;
  }
  private getConnection(pvName: string): Connection {
    for (const [prefix, connection] of this.prefixConnections) {
      if (pvName.startsWith(prefix)) {
        if (connection !== undefined) {
          return connection;
        } else {
          throw new Error(`Connection for ${prefix} not initiated`);
        }
      }
    }
    throw new Error(`No connections for ${pvName}`);
  }

  public subscribe(pvName: string, type: SubscriptionType): string {
    const connection = this.getConnection(pvName);
    return connection.subscribe(pvName, type);
  }

  public subscribe_device(deviceName: string): string {
    const connection = this.getConnection(deviceName);
    return connection.subscribe_device(deviceName);
  }

  public unsubscribe(pvName: string): void {
    const connection = this.getConnection(pvName);
    return connection.unsubscribe(pvName);
  }

  public isConnected(): boolean {
    return this.connected;
  }

  public putPv(pvName: string, value: any): void {
    const connection = this.getConnection(pvName);
    return connection.putPv(pvName, value);
  }

  public connect(
    connectionCallback: ConnectionChangedCallback,
    valueCallback: ValueChangedCallback,
    deviceQueryCallback: DeviceQueryCallback
  ): void {
    for (const [, connection] of this.prefixConnections) {
      if (connection !== undefined) {
        if (!connection.isConnected()) {
          connection.connect(connectionCallback, valueCallback, deviceQueryCallback);
        }
      }
    }
  }
}
