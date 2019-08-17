import { createStore, applyMiddleware } from "redux";

import { csReducer } from "./csReducer";
import { connectionMiddleware } from "./connectionMiddleware";

const middleware = applyMiddleware(connectionMiddleware);

export const store = createStore(csReducer, middleware);
