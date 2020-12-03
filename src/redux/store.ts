import { createStore, applyMiddleware, compose } from "redux";

import { csReducer } from "./csState";
import { connectionMiddleware } from "./connectionMiddleware";
import { throttleMiddleware, UpdateThrottle } from "./throttleMiddleware";
import { Connection } from "../connection/plugin";
import { SimulatorPlugin } from "../connection/sim";
import { ConiqlPlugin } from "../connection/coniql";
import { ConnectionForwarder } from "../connection/forwarder";

const CONIQL_SOCKET = process.env.REACT_APP_CONIQL_SOCKET;
const THROTTLE_PERIOD = parseFloat(
  process.env.REACT_APP_THROTTLE_PERIOD ?? "100"
);

const simulator = new SimulatorPlugin();
const plugins: [string, Connection][] = [
  ["sim://", simulator],
  ["loc://", simulator]
];
if (CONIQL_SOCKET !== undefined) {
  const coniql = new ConiqlPlugin(CONIQL_SOCKET);
  plugins.unshift(["pva://", coniql]);
  plugins.unshift(["ca://", coniql]);
  plugins.unshift(["ssim://", coniql]);
}
const connection = new ConnectionForwarder(plugins);

const composeEnhancers =
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(
  csReducer,
  /* preloadedState, */ composeEnhancers(
    applyMiddleware(
      connectionMiddleware(connection),
      throttleMiddleware(new UpdateThrottle(THROTTLE_PERIOD))
    )
  )
);
