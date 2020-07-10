import log from "loglevel";
import base64js from "base64-js";
import { ApolloClient } from "apollo-client";
import { ApolloLink } from "apollo-link";
import { onError } from "apollo-link-error";
import { HttpLink } from "apollo-link-http";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";
import gql from "graphql-tag";
import {
  InMemoryCache,
  NormalizedCacheObject,
  IntrospectionFragmentMatcher
} from "apollo-cache-inmemory";
import introspectionQueryResultData from "./fragmentTypes.json";
import {
  Connection,
  ConnectionChangedCallback,
  ValueChangedCallback,
  DeviceQueryCallback,
  nullConnCallback,
  nullValueCallback,
  nullDeviceQueryCallback,
  SubscriptionType
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
    ddisplay
  );
}

const DEVICE_QUERY = gql`
  query query1($devName: ID!) {
    getDevice(id: $devName) {
      id
      children(flatten:true) {
        name
        label
        child {
          __typename
          ... on Channel {
            id
          }
          ... on Device {
            id
          }
          ... on Group {
            layout
            children {
              name
            }
          }
        }
      }
    }
  }
`;

const PV_QUERY = gql`
  query query2($pvName: ID!) {
    getChannel(id: $pvName) {
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
      }
    }
  }
`;

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

export class ConiqlPlugin implements Connection {
  private client: ApolloClient<NormalizedCacheObject>;
  private onConnectionUpdate: ConnectionChangedCallback;
  private onValueUpdate: ValueChangedCallback;
  private onDeviceQueryUpdate: DeviceQueryCallback;
  private connected: boolean;
  private wsClient: SubscriptionClient;
  private disconnected: string[] = [];
  private subscriptions: { [pvName: string]: boolean };
  private devices: { [deviceName: string]: boolean };

  public constructor(socket: string) {
    const fragmentMatcher = new IntrospectionFragmentMatcher({
      introspectionQueryResultData
    });

    const cache = new InMemoryCache({ fragmentMatcher });
    this.wsClient = new SubscriptionClient(`ws://${socket}/ws`, {
      reconnect: true
    });
    this.wsClient.onReconnecting((): void => {
      for (const pvName of this.disconnected) {
        this._subscribe(pvName);
      }
      this.disconnected = [];
    });
    this.wsClient.onDisconnected((): void => {
      log.error("Websockect client disconnected.");
      for (const pvName of Object.keys(this.subscriptions)) {
        this.subscriptions[pvName] = false;
        this.onConnectionUpdate(pvName, {
          isConnected: false,
          isReadonly: true
        });
      }
    });
    const link = this.createLink(socket);
    this.client = new ApolloClient({ link, cache });
    this.onConnectionUpdate = nullConnCallback;
    this.onValueUpdate = nullValueCallback;
    this.onDeviceQueryUpdate = nullDeviceQueryCallback;
    this.connected = false;
    this.subscriptions = {};
    this.devices = {};
  }

  public createLink(socket: string): ApolloLink {
    const link: ApolloLink = ApolloLink.split(
      ({ query }): boolean => {
        // https://github.com/apollographql/apollo-client/issues/3090
        const definition = getMainDefinition(query);
        return (
          definition.kind === "OperationDefinition" &&
          definition.operation === "subscription"
        );
      },
      new WebSocketLink(this.wsClient),
      new HttpLink({ uri: `http://${socket}/graphql`, credentials: 'include' })
    );

    //const errorLink = onError(error => {
    //  const { graphQLErrors = [], networkError = {}, operation = {}, forward } = 
    //    error || {};
    //  const { getContext } = operation || {};
    //  const { scope, headers = {} } = getContext() || {};
    //  const { message: networkErrorMessage = '' } = networkError || {};
    //  const networkFailed = message =>
    //    typeof message === 'string' &&
    //    message.startsWith('NetworkError when attempting to fetch resource');
    //  if (networkFailed(networkErrorMessage)) return forward(operation);
    //});

    const errorlink = onError(({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors)
      graphQLErrors.forEach(({ message, locations, path }) =>
       console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
       )
      );
    if (networkError) {
      console.log(`[Network error]: ${networkError}`);
      return forward(operation);
    }
    });
    return errorlink.concat(link);
 
 }

  public connect(
    connectionCallback: ConnectionChangedCallback,
    valueCallback: ValueChangedCallback,
    deviceQueryCallback: DeviceQueryCallback
  ): void {
    this.onConnectionUpdate = connectionCallback;
    this.onValueUpdate = valueCallback;
    this.onDeviceQueryUpdate = deviceQueryCallback;
    this.connected = true;
  }

  public isConnected(): boolean {
    return this.connected;
  }

  private _process_device(data: any, deviceName: string, operation: string) : void {
    // Process a device 
    const { children } = data.data[operation];
    this.onDeviceQueryUpdate(deviceName, children);
  }

  private _process(data: any, pvName: string, operation: string): void {
    // Process an update to a channel either from getChannel or subscribeChannel.
    const { value, time, status, display } = data.data[operation];
    if (status) {
      this.onConnectionUpdate(pvName, {
        isConnected: true,
        isReadonly: !status.mutable
      });
    }
    const dtype = coniqlToDType(value, time, status, display);
    this.onValueUpdate(pvName, dtype);
  }

  private _subscribe_device(deviceName: string): void {
    this.client
    .query({
      query: DEVICE_QUERY,
      variables: { devName: deviceName.replace("csim://","") } //NOT IDEAL TO SWAP OUT CSIM
    }).then( data => {
      this._process_device(data, deviceName, "getDevice");
      });
    }

  private _subscribe(pvName: string): void {
    // Make a query to get the initial values.
    // https://github.com/apollographql/subscriptions-transport-ws/issues/170
    this.client
      .query({
        query: PV_QUERY,
        variables: { pvName: pvName }
      })
      .then(data => {
        this._process(data, pvName, "getChannel");
      });
    // Subscribe to further updates.
    this.client
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
          this.onConnectionUpdate(pvName, {
            isConnected: false,
            isReadonly: true
          });
          this.disconnected.push(pvName);
        }
      });
  }

  public subscribe(pvName: string, type: SubscriptionType): string {
    // TODO: How to handle multiple subscriptions of different types to the same channel?
    if (this.subscriptions[pvName] === undefined) {
      this._subscribe(pvName);
    }
    this.subscriptions[pvName] = true;
    return pvName;
  }

  public subscribe_device(deviceName: string) : string {
    if (this.devices[deviceName] === undefined) {
      this._subscribe_device(deviceName);
    }
    this.devices[deviceName] = true;
    return deviceName;
  }

  public putPv(pvName: string, value: DType): void {
    log.debug(`Putting ${value} to ${pvName}.`);
    const variables = {
      pvName: pvName,
      value: value.getStringValue()
    };
    this.client.mutate({ mutation: PV_MUTATION, variables: variables });
  }

  public unsubscribe(pvName: string): void {
    // TODO: handle unsubscribing.
  }
}
