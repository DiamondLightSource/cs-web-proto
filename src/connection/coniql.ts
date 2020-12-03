/* Module that handles a GraphQL connection to the Coniql server.
   See https://github.com/dls-controls/coniql
 */
import log from "loglevel";
import base64js from "base64-js";
import { ApolloClient } from "apollo-client";
import { ApolloLink, from } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";
import gql from "graphql-tag";
import {
  InMemoryCache,
  NormalizedCacheObject,
  IntrospectionFragmentMatcher
} from "apollo-cache-inmemory";
import { onError } from "apollo-link-error";
import introspectionQueryResultData from "./fragmentTypes.json";
import {
  ConnectionChangedCallback,
  ValueChangedCallback,
  nullConnCallback,
  nullValueCallback,
  SubscriptionType,
  Connection,
  ConiqlDeviceConnection,
  PvConnection,
  DeviceChangedCallback,
  nullDeviceCallback
} from "./plugin";
import { SubscriptionClient } from "subscriptions-transport-ws";
import {
  DType,
  DTime,
  DAlarm,
  AlarmQuality,
  DDisplay,
  DRange,
  ChannelRole,
  DisplayForm
} from "../types/dtypes";
import { Subscription } from "apollo-client/util/Observable";

export interface ConiqlStatus {
  quality: "ALARM" | "WARNING" | "VALID" | "INVALID" | "UNDEFINED" | "CHANGING";
  message: string;
  mutable: boolean;
}

const QUALITY_TYPES = {
  VALID: AlarmQuality.VALID,
  ALARM: AlarmQuality.ALARM,
  WARNING: AlarmQuality.WARNING,
  INVALID: AlarmQuality.INVALID,
  UNDEFINED: AlarmQuality.UNDEFINED,
  CHANGING: AlarmQuality.CHANGING
};

interface ConiqlRange {
  min: number;
  max: number;
}

interface ConiqlDisplay {
  description: string;
  role: "RW" | "WO" | "RO";
  controlRange: ConiqlRange;
  displayRange: ConiqlRange;
  warningRange: ConiqlRange;
  alarmRange: ConiqlRange;
  units: string;
  precision: number;
  form: FORM;
  choices: string[];
}

const ROLES = {
  RW: ChannelRole.RW,
  RO: ChannelRole.RO,
  WO: ChannelRole.WO
};

type FORM =
  | "DEFAULT"
  | "STRING"
  | "BINARY"
  | "DECIMAL"
  | "HEX"
  | "EXPONENTIAL"
  | "ENGINEERING";

const FORMS = {
  DEFAULT: DisplayForm.DEFAULT,
  STRING: DisplayForm.STRING,
  BINARY: DisplayForm.BINARY,
  DECIMAL: DisplayForm.DECIMAL,
  HEX: DisplayForm.HEX,
  EXPONENTIAL: DisplayForm.EXPONENTIAL,
  ENGINEERING: DisplayForm.ENGINEERING
};

type CONIQL_TYPE =
  | "INT8"
  | "UINT8"
  | "INT16"
  | "UINT16"
  | "INT32"
  | "UINT32"
  | "INT32"
  | "INT64"
  | "FLOAT32"
  | "FLOAT64";

const ARRAY_TYPES = {
  INT8: Int8Array,
  UINT8: Uint8Array,
  INT16: Int16Array,
  UINT16: Uint16Array,
  INT32: Int32Array,
  UINT32: Uint32Array,
  INT64: BigInt64Array,
  UINT64: BigUint64Array,
  FLOAT32: Float32Array,
  FLOAT64: Float64Array
};

export interface ConiqlBase64Array {
  numberType: CONIQL_TYPE;
  base64: string;
}

interface ConiqlValue {
  string: string;
  float: number;
  base64Array: ConiqlBase64Array;
  stringArray: string[];
}

export interface ConiqlTime {
  datetime: Date;
}

function coniqlToDType(
  value: ConiqlValue,
  timeVal: ConiqlTime,
  status: ConiqlStatus,
  display: ConiqlDisplay
): DType {
  let alarm = undefined;
  let ddisplay = undefined;
  if (status) {
    alarm = new DAlarm(QUALITY_TYPES[status.quality], status.message);
  }
  if (display) {
    ddisplay = new DDisplay({
      description: display.description,
      role: display.role ? ROLES[display.role] : undefined,
      controlRange: display.controlRange
        ? new DRange(display.controlRange.min, display.controlRange.max)
        : undefined,
      alarmRange: display.alarmRange
        ? new DRange(display.alarmRange.min, display.alarmRange.max)
        : undefined,
      warningRange: display.warningRange
        ? new DRange(display.warningRange.min, display.warningRange.max)
        : undefined,
      units: display.units,
      precision: display.precision,
      form: display.form ? FORMS[display.form] : undefined,
      choices: display.choices
    });
  }
  let array = undefined;
  if (value?.base64Array) {
    const bd = base64js.toByteArray(value.base64Array.base64);
    array = new ARRAY_TYPES[value.base64Array.numberType as CONIQL_TYPE](
      bd.buffer
    );
  }
  let dtime = undefined;
  if (timeVal?.datetime) {
    dtime = new DTime(timeVal.datetime);
  }
  return new DType(
    {
      stringValue: value?.string,
      doubleValue: value?.float,
      arrayValue: array
    },
    alarm,
    dtime,
    ddisplay,
    // Coniql only returns changed values so these DTypes are
    // always partial.
    true
  );
}

const PV_SUBSCRIPTION = gql`
  subscription sub1($pvName: ID!) {
    subscribeChannel(id: $pvName) {
      id
      time {
        datetime
      }
      value {
        string
        float
        base64Array {
          numberType
          base64
        }
      }
      status {
        quality
        message
        mutable
      }
      display {
        units
        form
        controlRange {
          max
          min
        }
        choices
        precision
      }
    }
  }
`;

const PV_MUTATION = gql`
  mutation put1($pvName: ID!, $value: String!) {
    putChannels(ids: [$pvName], values: [$value]) {
      id
    }
  }
`;

const DEVICE_SUBSCRIPTION = gql`
  query deviceQuery($pvDevice: ID!) {
    getDevice(id: $pvDevice) {
      children(flatten: true) {
        label
        child {
          ... on Channel {
            value {
              string
            }
          }
        }
      }
    }
  }
`;

class ConiqlPlugin implements Connection {
  protected _client: ApolloClient<NormalizedCacheObject>;
  protected _onConnectionUpdate: ConnectionChangedCallback;
  protected _onValueUpdate: ValueChangedCallback;
  protected _onDeviceUpdate: DeviceChangedCallback;
  private connected: boolean;
  private wsClient: SubscriptionClient;
  protected _disconnected: string[] = [];
  // NOTE: This class handles devices and PVs hence pvDevice
  private subscriptions: { [pvDevice: string]: Subscription };

  public constructor(socket: string, type: string) {
    const fragmentMatcher = new IntrospectionFragmentMatcher({
      introspectionQueryResultData
    });

    const cache = new InMemoryCache({ fragmentMatcher });
    this.wsClient = new SubscriptionClient(`ws://${socket}/ws`, {
      reconnect: true
    });

    this.wsClient.onReconnecting((): void => {
      for (const pvDevice of this._disconnected) {
        this._subscribe(pvDevice);
      }
      this._disconnected = [];
    });

    this.wsClient.onDisconnected((): void => {
      log.error("Websockect client disconnected.");
      for (const pvDevice of Object.keys(this.subscriptions)) {
        this.unsubscribe(pvDevice);
        this._onConnectionUpdate(pvDevice, type, {
          isConnected: false,
          isReadonly: true
        });
      }
    });

    const link = this.createLink(socket);
    this._client = new ApolloClient({ link, cache });
    this._onConnectionUpdate = nullConnCallback;
    this._onValueUpdate = nullValueCallback;
    this._onDeviceUpdate = nullDeviceCallback;
    this.connected = false;
    this.subscriptions = {};
  }

  public connect(
    connectionCallback: ConnectionChangedCallback,
    valueCallback: ValueChangedCallback,
    deviceCallback: DeviceChangedCallback
  ): void {
    this._onConnectionUpdate = connectionCallback;
    this._onValueUpdate = valueCallback;
    this._onDeviceUpdate = deviceCallback;
    this.connected = true;
  }

  public isConnected(): boolean {
    return this.connected;
  }

  public createLink(socket: string): ApolloLink {
    const wsLink = new WebSocketLink(this.wsClient);
    const errorLink = onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        log.error("GraphQL errors:");
        graphQLErrors.forEach((error): void => {
          log.error(error);
        });
      }
      if (networkError) {
        log.error("Network error:");
        log.error(networkError);
      }
    });
    const httpLink = new HttpLink({ uri: `http://${socket}/graphql` });
    const link: ApolloLink = ApolloLink.split(
      ({ query }): boolean => {
        // https://github.com/apollographql/apollo-client/issues/3090
        const definition = getMainDefinition(query);
        return (
          definition.kind === "OperationDefinition" &&
          definition.operation === "subscription"
        );
      },
      from([errorLink, wsLink]),
      from([errorLink, httpLink])
    );

    return link;
  }

  /**
   * This should be overridden in the child class, and it's implementation
   * will depend on the type of subscription (currently device of PV)
   * @param pvDevice
   */
  protected _subscribe(pvDevice: string): Subscription {
    throw new Error("_subscribe method not implemented");
  }

  public subscribe(pvDevice: string, type: SubscriptionType): string {
    if (this.subscriptions[pvDevice] === undefined) {
      this.subscriptions[pvDevice] = this._subscribe(pvDevice);
    }
    return pvDevice;
  }

  public unsubscribe(pvDevice: string): void {
    if (
      this.subscriptions.hasOwnProperty(pvDevice) &&
      this.subscriptions[pvDevice]
    ) {
      this.subscriptions[pvDevice].unsubscribe();
      delete this.subscriptions[pvDevice];
    } else {
      log.error(`Attempt to unsubscribe from ${pvDevice} failed`);
    }
  }
}

export class ConiqlDevicePlugin extends ConiqlPlugin
  implements ConiqlDeviceConnection {
  constructor(socket: string) {
    super(socket, "device");
  }

  private _process(data: any, device: string, operation: string): void {
    this._onDeviceUpdate(
      device,
      new DType({ stringValue: JSON.stringify(data.data) })
    );
  }

  protected _subscribe(pvDevice: string): Subscription {
    return this._client
      .subscribe({
        query: DEVICE_SUBSCRIPTION,
        variables: { pvDevice: pvDevice.split("://")[1] }
      })
      .subscribe({
        next: (data): void => {
          this._process(data, pvDevice, "subscribeDevice");
        },
        error: (err): void => {
          log.error("err", err);
        },
        complete: (): void => {
          this._onConnectionUpdate(pvDevice, "device", {
            isConnected: false,
            isReadonly: true
          });
          this._disconnected.push(pvDevice);
        }
      });
  }
}

export class ConiqlPvPlugin extends ConiqlPlugin implements PvConnection {
  constructor(socket: string) {
    super(socket, "pv");
  }

  private _process(data: any, pvName: string, operation: string): void {
    // Process an update to a channel either from getChannel or subscribeChannel.
    const { value, time, status, display } = data.data[operation];
    if (status) {
      this._onConnectionUpdate(pvName, "pv", {
        isConnected: true,
        isReadonly: !status.mutable
      });
    }
    const dtype = coniqlToDType(value, time, status, display);
    this._onValueUpdate(pvName, dtype);
  }

  protected _subscribe(pvName: string): Subscription {
    return this._client
      .subscribe({
        query: PV_SUBSCRIPTION,
        variables: { pvName: pvName }
      })
      .subscribe({
        next: (data): void => {
          this._process(data, pvName, "subscribeChannel");
        },
        error: (err): void => {
          log.error("err", err);
        },
        complete: (): void => {
          // complete is called when the websocket is disconnected.
          this._onConnectionUpdate(pvName, "pv", {
            isConnected: false,
            isReadonly: true
          });
          this._disconnected.push(pvName);
        }
      });
  }

  public putPv(pvName: string, value: DType): void {
    log.debug(`Putting ${value} to ${pvName}.`);
    const variables = {
      pvName: pvName,
      value: DType.coerceString(value)
    };
    this._client
      .mutate({ mutation: PV_MUTATION, variables: variables })
      .catch(error => {
        log.error(`Failed to write ${value} to ${pvName}`);
        log.error(error);
      });
  }
}
