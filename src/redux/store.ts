import { createStore, applyMiddleware } from "redux";

import { csReducer } from "./csReducer";
import { connectionMiddleware } from "./connectionMiddleware";
import { NType } from "../cs";

export interface ValueCache {
  [key: string]: NType;
}

export interface CsState {
  valueCache: ValueCache;
}

const middleware = applyMiddleware(connectionMiddleware);

export const store = createStore(csReducer, middleware);
