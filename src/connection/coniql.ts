import { ApolloClient } from "apollo-client";
import { ApolloLink } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";
import gql from "graphql-tag";
import { InMemoryCache, NormalizedCacheObject } from "apollo-cache-inmemory";
import { NType, PartialNType } from "../ntypes";
import {
  Connection,
  ConnectionChangedCallback,
  ValueChangedCallback,
  nullConnCallback,
  nullValueCallback
} from "./plugin";

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

function coniqlToNType(value: any, meta: any, status: Status): PartialNType {
  let result: PartialNType = {
    value: value
  };
  if (meta) {
    const bit = meta.array ? "Array" : "Scalar";
    const type = `NT${bit}`;
    result.type = type;
  }
  if (status) {
    result.alarm = { severity: ALARMS[status.quality] };
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

const cache = new InMemoryCache();

const PV_SUBSCRIPTION = gql`
  subscription sub1($pvName: String!) {
    subscribeChannel(id: $pvName) {
      value
      meta {
        __typename
        array
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
          //console.log("data", data); //eslint-disable-line no-console
          this.onConnectionUpdate(pvName1, { isConnected: true });
          const { value, meta, status } = data.data.subscribeChannel;
          let ntValue = coniqlToNType(value, meta, status);
          this.onValueUpdate(pvName1, ntValue);
        },
        error: (err): void => {
          console.error("err", err); //eslint-disable-line no-console
        }
      });
  }

  public putPv(pvName: string, value: NType): void {
    // noop
  }

  public getValue(pvName: string): NType {
    return { type: "NTScalarDouble", value: "" };
  }

  public unsubscribe(pvName: string): void {
    // noop
  }
}
