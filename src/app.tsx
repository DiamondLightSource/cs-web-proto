import React, { Profiler, useState } from "react";
import "./app.css";
import { Provider } from "react-redux";
import { getStore, initialiseStore } from "./redux/store";
import log from "loglevel";
import { lightTheme, darkTheme, ThemeContext } from "./themeContext";
import { SimulatorPlugin } from "./connection/sim";
import { ConiqlPlugin } from "./connection/coniql";
import { ConnectionForwarder } from "./connection/forwarder";
import { Connection } from "./connection/plugin";
import { EmbeddedDisplay } from "./ui/widgets";
import { BaseUrlContext } from "./baseUrl";
import { onRenderCallback } from "./profilerCallback";
import { RelativePosition } from "./types/position";
import {
  FileContext,
  FileContextType,
  LocationCache,
  FileDescription
} from "./fileContext";

let settings: any;
try {
  // Use require so that we can catch this error
  settings = require("./settings");
} catch (e) {
  settings = {};
}

const baseUrl = settings.baseUrl ?? "http://localhost:3000";
const SIMULATION_TIME = settings.simulationTime ?? 100;
const THROTTLE_PERIOD = settings.throttlePeriod ?? 100;

log.setLevel("info");

function applyTheme(theme: any): void {
  Object.keys(theme).forEach(function(key): void {
    const value = theme[key];
    document.documentElement.style.setProperty(key, value);
  });
}

const App: React.FC = (): JSX.Element => {
  const simulator = new SimulatorPlugin(SIMULATION_TIME);
  const fallbackPlugin = simulator;
  const plugins: [string, Connection][] = [
    ["sim://", simulator],
    ["loc://", simulator],
    ["", fallbackPlugin]
  ];
  if (settings.coniqlSocket !== undefined) {
    const coniql = new ConiqlPlugin(settings.coniqlSocket);
    plugins.unshift(["pva://", coniql]);
    plugins.unshift(["ca://", coniql]);
    plugins.unshift(["csim://", coniql]);
  }
  const plugin = new ConnectionForwarder(plugins);
  initialiseStore(plugin, THROTTLE_PERIOD);
  const store = getStore();
  const { toggle, dark } = React.useContext(ThemeContext);
  applyTheme(dark ? darkTheme : lightTheme);

  const [locations, setLocations] = useState<LocationCache>({
    app: [
      "home",
      {
        path: "home.json",
        type: "json",
        macros: {},
        defaultProtocol: "pva"
      }
    ]
  });
  const fileContext: FileContextType = {
    locations: locations,
    addFile: (location: string, desc: FileDescription, name: string) => {
      const locationsCopy = { ...locations };
      locationsCopy[location] = [name, desc];
      setLocations(locationsCopy);
    },
    removeFile: (location: string, desc: FileDescription) => {
      // TODO: match the description.
      const locationsCopy = { ...locations };
      delete locationsCopy[location];
      setLocations(locationsCopy);
    }
  };

  return (
    <FileContext.Provider value={fileContext}>
      <BaseUrlContext.Provider value={baseUrl}>
        <Provider store={store}>
          <div className="App">
            <button type="button" onClick={toggle}>
              Toggle Theme
            </button>
            <Profiler id="Dynamic Page Profiler" onRender={onRenderCallback}>
              <EmbeddedDisplay
                position={new RelativePosition()}
                file={{
                  path: "app.json",
                  type: "json",
                  defaultProtocol: "pva",
                  macros: {}
                }}
              />
            </Profiler>
          </div>
        </Provider>
      </BaseUrlContext.Provider>
    </FileContext.Provider>
  );
};

export default App;
