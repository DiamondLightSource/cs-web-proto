import { ApolloClient } from "apollo-client";
import { ApolloLink } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";
import gql from "graphql-tag";
import { InMemoryCache, NormalizedCacheObject } from "apollo-cache-inmemory";
import log from "loglevel";
import { VType } from "../vtypes/vtypes";
import {
  Connection,
  ConnectionChangedCallback,
  ValueChangedCallback,
  nullConnCallback,
  nullValueCallback
} from "./plugin";

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
    subscribeFloatScalar(channel: $pvName) {
      value
    }
  }
`;

export class ConiqlPlugin implements Connection {
  private client: ApolloClient<NormalizedCacheObject>;
  private onConnectionUpdate: ConnectionChangedCallback;
  private onValueUpdate: ValueChangedCallback;

  public constructor(socket: string) {
    const link = createLink(socket);
    this.client = new ApolloClient({ link, cache });
    this.onConnectionUpdate = nullConnCallback;
    this.onValueUpdate = nullValueCallback;
  }

  public connect(
    connectionCallback: ConnectionChangedCallback,
    valueCallback: ValueChangedCallback
  ): void {
    this.onConnectionUpdate = connectionCallback;
    this.onValueUpdate = valueCallback;
  }

  public isConnected(): boolean {
    return this.client != null;
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
          this.onValueUpdate(pvName1, data.data.subscribeFloatScalar);
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
