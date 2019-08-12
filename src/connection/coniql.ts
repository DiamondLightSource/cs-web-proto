import { ApolloClient } from "apollo-client";
import { ApolloLink } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";
import gql from "graphql-tag";
import { InMemoryCache, NormalizedCacheObject } from "apollo-cache-inmemory";
import { NType } from "../cs";

const httpUri = "htop://localhost:8000/graphql";
const wsUri = "ws://localhost:8000/subscriptions";

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
    uri: wsUri,
    options: {
      reconnect: true
    }
  }),
  new HttpLink({ uri: httpUri })
);

const cache = new InMemoryCache(window.__APOLLO_STATE);

const PV_SUBSCRIPTION = gql`
  subscription sub {
    subscribeFloatScalar(channel: "TMC43-TS-IOC-01:AI") {
      value
    }
  }
`;
/*
const PV_SUBSCRIPTION1 = gql`
  subscription($pvName: String!) {
    subscribeFloatScalar(channel: $pvName) {
      value
    }
  }
`;
*/

export class ConiqlPlugin {
  private url: string;
  private client: ApolloClient<NormalizedCacheObject>;
  private callback: (pvName: string, data: NType) => void;

  public constructor(
    websocketUrl: string,
    callback: (pvName: string, data: NType) => void
  ) {
    this.url = websocketUrl;
    this.client = new ApolloClient({ link, cache });
    this.callback = callback;
  }

  public subscribe(pvName1: string): void {
    this.client
      .subscribe({
        query: PV_SUBSCRIPTION,
        variables: { pvName: pvName1 }
      })
      .subscribe({
        next: data => {
          console.log("data", data);
          this.callback(pvName1, data.data.subscribeFloatScalar);
        },
        error: err => {
          console.error("err", err);
        }
      });
  }
}
