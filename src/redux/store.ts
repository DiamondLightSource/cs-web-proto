import {createStore, applyMiddleware} from 'redux';

import {csReducer} from './CSReducer';
import {connectionMiddleware} from './ConnectionMiddleware';

const middleware = applyMiddleware(connectionMiddleware);

export const store = createStore(csReducer, middleware);