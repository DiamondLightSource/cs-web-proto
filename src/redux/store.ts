import { createStore, applyMiddleware, Store} from "redux";

import { csReducer, CsStore } from "./csReducer";
import { connectionMiddleware } from "./connectionMiddleware";
import { NType } from "../cs";

export interface ValueCache {
  [key: string]: NType;
}

export interface CsState {
  valueCache: ValueCache;
}

const middleware = applyMiddleware(connectionMiddleware);

// Setting this to Action or Action<Any> seems to trip up the type system
type MyStore = Store<CsStore, any>;
let store : MyStore | null = null;

export function initialiseStore(): void{
    store = createStore(csReducer, middleware);
}

function raiseStoreEmpty() : never {
    throw new Error('store singleton is not initialised. (see initialiseStore())');
}

export function getStore(): MyStore {
    return store || raiseStoreEmpty();
}
