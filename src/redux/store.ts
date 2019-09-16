import { createStore, applyMiddleware, Store, compose } from "redux";

import { csReducer, CsState } from "./csState";
import { connectionMiddleware } from "./connectionMiddleware";
import { Connection } from "../connection/plugin";

// Setting this to Action or Action<Any> seems to trip up the type system
type MyStore = Store<CsState, any>;
let store: MyStore | null = null;

export function initialiseStore(connection: Connection): void {
  const composeEnhancers =
    (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  store = createStore(
    csReducer,
    /* preloadedState, */ composeEnhancers(
      applyMiddleware(connectionMiddleware(connection))
    )
  );
}

function raiseStoreEmpty(): never {
  throw new Error(
    "store singleton is not initialised. (see initialiseStore())"
  );
}

export function getStore(): MyStore {
  return store || raiseStoreEmpty();
}
