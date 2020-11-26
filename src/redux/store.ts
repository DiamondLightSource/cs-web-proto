import { createStore, applyMiddleware, compose } from "redux";
import { Connection } from "../connection/plugin";
import { csReducer } from "./csState";
import { connectionMiddleware } from "./connectionMiddleware";
import { throttleMiddleware, UpdateThrottle } from "./throttleMiddleware";
import { SimulatorPlugin } from "../connection/sim";
import { ConiqlPvPlugin, ConiqlDevicePlugin } from "../connection/coniql";
import { ConnectionForwarder } from "../connection/forwarder";

const CONIQL_SOCKET = process.env.REACT_APP_CONIQL_SOCKET;
const THROTTLE_PERIOD = parseFloat(
  process.env.REACT_APP_THROTTLE_PERIOD ?? "100"
);

const SIMULATION_TIME = parseFloat(
  process.env.REACT_APP_SIMULATION_TIME ?? "100"
);

const simulator = new SimulatorPlugin(SIMULATION_TIME);
const plugins: [string, Connection][] = [
  ["sim://", simulator],
  ["loc://", simulator]
];

if (CONIQL_SOCKET !== undefined) {
  const coniqlPv = new ConiqlPvPlugin(CONIQL_SOCKET);
  plugins.unshift(["pva://", coniqlPv]);
  plugins.unshift(["ca://", coniqlPv]);
  plugins.unshift(["ssim://", coniqlPv]);
  const coniqlDevice = new ConiqlDevicePlugin(CONIQL_SOCKET);
  plugins.unshift(["device://", coniqlDevice]);
}
const connection = new ConnectionForwarder(plugins);

const composeEnhancers =
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(
  csReducer,
  composeEnhancers(
    applyMiddleware(
      connectionMiddleware(connection),
      throttleMiddleware(new UpdateThrottle(THROTTLE_PERIOD))
    )
    // other store enhancers here
  )
);
