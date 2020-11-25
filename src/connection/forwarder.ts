import {
  Connection,
  ConiqlDeviceConnection,
  ConnectionChangedCallback,
  ValueChangedCallback,
  SubscriptionType,
  DeviceChangedCallback,
  PvConnection
} from "./plugin";

export class ConnectionForwarder implements Connection {
  private prefixConnections: [string, Connection | undefined][];
  private connected: boolean;
  public constructor(prefixConnections: [string, Connection | undefined][]) {
    this.prefixConnections = prefixConnections;
    this.connected = false;
  }
  private getConnection(
    pvDevice: string
  ): ConiqlDeviceConnection | PvConnection {
    for (const [prefix, connection] of this.prefixConnections) {
      if (pvDevice.startsWith(prefix)) {
        if (connection !== undefined) {
          return connection;
        } else {
          throw new Error(`Connection for ${prefix} not initiated`);
        }
      }
    }
    throw new Error(`No connections for ${pvDevice}`);
  }

  public subscribe(pvDevice: string, type: SubscriptionType): string {
    const connection = this.getConnection(pvDevice);
    return connection.subscribe(pvDevice, type);
  }

  public unsubscribe(pvDevice: string): void {
    const connection = this.getConnection(pvDevice);
    return connection.unsubscribe(pvDevice);
  }

  public isConnected(): boolean {
    return this.connected;
  }

  public putPv(pvDevice: string, value: any): void {
    const connection = this.getConnection(pvDevice) as PvConnection;
    return connection.putPv(pvDevice, value);
  }

  public connect(
    connectionCallback: ConnectionChangedCallback,
    valueCallback: ValueChangedCallback,
    deviceCallback: DeviceChangedCallback
  ): void {
    for (const [, connection] of this.prefixConnections) {
      if (connection !== undefined) {
        if (!connection.isConnected()) {
          connection.connect(connectionCallback, valueCallback, deviceCallback);
        }
      }
    }
  }
}
