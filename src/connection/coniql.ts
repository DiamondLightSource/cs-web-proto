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
  nullValueCallback
} from "./plugin";
import { VType } from "../vtypes/vtypes";
import { AlarmStatus, alarm } from "../vtypes/alarm";
import { time } from "../vtypes/time";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { display } from "../vtypes/display";
import { PartialVType } from "../vtypes/merge";

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
  INT64: "VLong"
};

const ARRAY_TYPES = {
  FLOAT64: Float64Array,
  INT32: Int32Array,
  // I don't know why I can't use BigInt64Array.
  INT64: Int32Array
};

function coniqlToPartialVtype(
  value: any,
  timeVal: ConiqlTime,
  meta: any,
  status: ConiqlStatus
): PartialVType {
  let result: PartialVType = {
    value: value
  };
  if (value && value.numberType) {
    const bd = base64js.toByteArray(value.base64);
    const array = new ARRAY_TYPES[value.numberType as CONIQL_TYPE](bd.buffer);
    result.value = array;
  }
  if (timeVal) {
    result.time = time(
      { secondsPastEpoch: timeVal.seconds, nanoseconds: timeVal.nanoseconds },
      timeVal.userTag,
      false
    );
  }
  if (meta) {
    result.array = meta.array;
    if (meta.__typename === "NumberMeta") {
      result.type = VTYPE_CLASSES[meta.numberType as CONIQL_TYPE];
      if (meta.display) {
        const {
          controlRange,
          displayRange,
          alarmRange,
          warningRange,
          units
        } = meta.display;
        result.display = display(
          displayRange,
          alarmRange,
          warningRange,
          controlRange,
          units
        );
      }
    } else {
      result.type = VTYPE_CLASSES[meta.type as CONIQL_TYPE];
    }
  }
  if (status) {
    result.alarm = alarm(ALARMS[status.quality], AlarmStatus.NONE, "");
  }
  return result;
}

const PV_SUBSCRIPTION = gql`
  subscription sub1($pvName: String!) {
    subscribeChannel(id: $pvName) {
      value
      time {
        seconds
        nanoseconds
        userTag
      }
      meta {
        __typename
        array
        ... on ObjectMeta {
          array
          type
        }
        ... on NumberMeta {
          array
          numberType
          display {
            controlRange {
              min
              max
            }
            displayRange {
              min
              max
            }
            alarmRange {
              min
              max
            }
            warningRange {
              min
              max
            }
            units
            precision
            form
          }
        }
      }
      status {
        quality
        message
        mutable
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
    this.wsClient = new SubscriptionClient(`ws://${socket}/subscriptions`, {
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
          log.trace("data", data);
          const { value, time, meta, status } = data.data.subscribeChannel;
          if (meta) {
            this.onConnectionUpdate(pvName, {
              isConnected: true,
              isReadonly: !meta.mutable
            });
          }
          let pvtype = coniqlToPartialVtype(value, time, meta, status);
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

  public subscribe(pvName: string): string {
    if (this.subscriptions[pvName] === undefined) {
      this._subscribe(pvName);
    }
    this.subscriptions[pvName] = true;
    return pvName;
  }

  public putPv(pvName: string, value: VType): void {
    // noop
  }

  public unsubscribe(pvName: string): void {
    // noop
  }
}
