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
  Connection,
  ConnectionChangedCallback,
  ValueChangedCallback,
  nullConnCallback,
  nullValueCallback,
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

export class ConiqlPlugin implements Connection {
  private client: ApolloClient<NormalizedCacheObject>;
  private onConnectionUpdate: ConnectionChangedCallback;
  private onValueUpdate: ValueChangedCallback;
  private connected: boolean;
  private wsClient: SubscriptionClient;
  private disconnected: string[] = [];
  private subscriptions: { [pvName: string]: Subscription };

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
      log.error("Websocket client disconnected.");
      for (const pvName of Object.keys(this.subscriptions)) {
        if (
          this.subscriptions.hasOwnProperty(pvName) &&
          this.subscriptions[pvName]
        ) {
          this.subscriptions[pvName].unsubscribe();
          delete this.subscriptions[pvName];
        } else {
          log.error(`Attempt to unsubscribe from ${pvName} failed`);
        }
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
    this.connected = false;
    this.subscriptions = {};
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

  public connect(
    connectionCallback: ConnectionChangedCallback,
    valueCallback: ValueChangedCallback
  ): void {
    this.onConnectionUpdate = connectionCallback;
    this.onValueUpdate = valueCallback;
    this.connected = true;
  }

  public isConnected(): boolean {
    return this.connected;
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

  private _subscribe(pvName: string): Subscription {
    return this.client
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
      this.subscriptions[pvName] = this._subscribe(pvName);
    }
    return pvName;
  }

  public putPv(pvName: string, value: DType): void {
    log.debug(`Putting ${value} to ${pvName}.`);
    const variables = {
      pvName: pvName,
      value: DType.coerceString(value)
    };
    this.client
      .mutate({ mutation: PV_MUTATION, variables: variables })
      .catch(error => {
        log.error(`Failed to write ${value} to ${pvName}`);
        log.error(error);
      });
  }

  public unsubscribe(pvName: string): void {
    // Note that connectionMiddleware handles multiple subscriptions
    // for the same PV at present, so if this method is called then
    // there is no further need for this PV.
    // Note that a bug in tartiflette-aiohttp means that the
    // unsubscribe does not work on Python 3.8.
    // https://github.com/tartiflette/tartiflette-aiohttp/pull/81
    this.subscriptions[pvName].unsubscribe();
    delete this.subscriptions[pvName];
  }
}
