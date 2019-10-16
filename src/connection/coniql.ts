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
import log from "loglevel";
import { VType } from "../vtypes/vtypes";
import {
  Connection,
  ConnectionChangedCallback,
  ValueChangedCallback,
  nullConnCallback,
  nullValueCallback
} from "./plugin";
import { PartialVType } from "../redux/csState";
import { AlarmStatus, alarm } from "../vtypes/alarm";
import base64js from "base64-js";
import { time } from "../vtypes/time";

interface Status {
  quality: "ALARM" | "WARNING" | "VALID";
  message: string;
  mutable: boolean;
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

function coniqlToVType(
  value: any,
  timeVal: any,
  meta: any,
  status: Status
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
    } else {
      result.type = VTYPE_CLASSES[meta.type as CONIQL_TYPE];
    }
  }
  if (status) {
    result.alarm = alarm(ALARMS[status.quality], AlarmStatus.NONE, "");
  }
  return result;
}

function createLink(socket: string): ApolloLink {
  const link: ApolloLink = ApolloLink.split(
    ({ query }): boolean => {
      // https://github.com/apollographql/apollo-client/issues/3090
      const definition = getMainDefinition(query);
      return (
        definition.kind === "OperationDefinition" &&
        definition.operation === "subscription"
      );
    },
    new WebSocketLink({
      uri: `ws://${socket}/subscriptions`,
      options: {
        reconnect: true
      }
    }),
    new HttpLink({ uri: `http://${socket}/graphql` })
  );

  return link;
}

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData
});
const cache = new InMemoryCache({ fragmentMatcher });

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

  public constructor(socket: string) {
    const link = createLink(socket);
    this.client = new ApolloClient({ link, cache });
    this.onConnectionUpdate = nullConnCallback;
    this.onValueUpdate = nullValueCallback;
    this.connected = false;
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

  public subscribe(pvName1: string): void {
    this.client
      .subscribe({
        query: PV_SUBSCRIPTION,
        variables: { pvName: pvName1 }
      })
      .subscribe({
        next: (data): void => {
          log.debug("data", data);
          this.onConnectionUpdate(pvName1, { isConnected: true });
          const { value, time, meta, status } = data.data.subscribeChannel;
          let vtype = coniqlToVType(value, time, meta, status);
          this.onValueUpdate(pvName1, vtype);
        },
        error: (err): void => {
          log.error("err", err);
        }
      });
  }

  public putPv(pvName: string, value: VType): void {
    // noop
  }

  public unsubscribe(pvName: string): void {
    // noop
  }
}
