import log from "loglevel";
import base64js from "base64-js";
import { ApolloClient } from "apollo-client";
import { ApolloLink } from "apollo-link";
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
  nullConnCallback,
  nullValueCallback,
  PVType
} from "./plugin";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { DType } from "../types/dtypes";

export interface ConiqlStatus {
  quality: "ALARM" | "WARNING" | "VALID";
  message: string;
  mutable: boolean;
}

export interface ConiqlTime {
  seconds: number;
  nanoseconds: number;
  userTag: number;
}

const ALARMS = {
  ALARM: 2,
  WARNING: 1,
  VALID: 0
};

type CONIQL_TYPE = "FLOAT64" | "INT32" | "INT64";

const VTYPE_CLASSES = {
  FLOAT64: "VDouble",
  INT32: "VInt",
  INT64: "VLong",
  String: "VString"
};

const ARRAY_TYPES = {
  FLOAT64: Float64Array,
  INT32: Int32Array,
  // I don't know why I can't use BigInt64Array.
  INT64: Int32Array
};

function coniqlToDtype(
  value: any,
  timeVal: ConiqlTime,
  status: ConiqlStatus,
  display: any
): DType {
  // TODO handle time, alarm, display
  return new DType({
    stringValue: value.string,
    doubleValue: value.float,
    arrayValue: value.base64Array
  });
}

const PV_SUBSCRIPTION = gql`
  subscription sub1($pvName: ID!) {
    subscribeChannel(id: $pvName) {
      id
      time {
        seconds
        nanoseconds
        userTag
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
      }
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
  private subscriptions: { [pvName: string]: boolean };

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
    const link = this.createLink(socket);
    this.client = new ApolloClient({ link, cache });
    this.onConnectionUpdate = nullConnCallback;
    this.onValueUpdate = nullValueCallback;
    this.connected = false;
    this.subscriptions = {};
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
      new HttpLink({ uri: `http://${socket}/graphql` })
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

  private _subscribe(pvName: string): void {
    this.client
      .subscribe({
        query: PV_SUBSCRIPTION,
        variables: { pvName: pvName }
      })
      .subscribe({
        next: (data): void => {
          log.info("data", data);
          const { value, time, status, display } = data.data.subscribeChannel;
          console.log(`status? ${status}`);
          if (status) {
            this.onConnectionUpdate(pvName, {
              isConnected: true,
              isReadonly: !status.mutable
            });
          }
          const pvtype = coniqlToDtype(value, time, status, display);
          this.onValueUpdate(pvName, pvtype);
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

  public subscribe(pvName: string, type: PVType): string {
    // How to handle multiple subscriptions of different types to the same channel?
    if (this.subscriptions[pvName] === undefined) {
      this._subscribe(pvName);
    }
    this.subscriptions[pvName] = true;
    return pvName;
  }

  public putPv(pvName: string, value: DType): void {
    // noop
  }

  public unsubscribe(pvName: string): void {
    // noop
  }
}
