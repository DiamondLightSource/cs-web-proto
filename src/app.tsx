import React, { Profiler } from "react";
import "./app.css";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { getStore, initialiseStore } from "./redux/store";
import log from "loglevel";
import { lightTheme, darkTheme, ThemeContext } from "./themeContext";
import { SimulatorPlugin } from "./connection/sim";
import { ConiqlPlugin } from "./connection/coniql";
import { ConnectionForwarder } from "./connection/forwarder";
import { DynamicPageWidget } from "./ui/widgets/DynamicPage/dynamicPage";
import { Connection } from "./connection/plugin";
import { ActionButton } from "./ui/widgets";
import { OPEN_PAGE } from "./ui/widgets/widgetActions";
import { BaseUrlContext } from "./baseUrl";

let settings: any;
try {
  // Use require so that we can catch this error
  settings = require("./settings");
} catch (e) {
  settings = {};
}

const baseUrl = settings.baseUrl ?? "http://localhost:3000";

log.setLevel("info");

function applyTheme(theme: any): void {
  Object.keys(theme).forEach(function(key): void {
    const value = theme[key];
    document.documentElement.style.setProperty(key, value);
  });
}

const SIMULATION_TIME = 1000;

const recordedTimings = {
  startTime: 0,
  actualDur: 0,
  baseDur: 0,
  reconciliation: 0
};

function onRenderCallback(
  id: string,
  phase: "mount" | "update",
  actualDuration: number,
  baseDuration: number,
  startTime: number,
  commitTime: number,
  interactions: any
): void {
  const reconciliationTime = commitTime - startTime;

  if (
    recordedTimings.startTime === 0 ||
    startTime > recordedTimings.startTime + SIMULATION_TIME / 2
  ) {
    // Add final timings
    recordedTimings.actualDur += actualDuration;
    recordedTimings.baseDur += baseDuration;
    recordedTimings.reconciliation += reconciliationTime;
    // Produce a csv friendly output
    log.info(`actualDuration,baseDuration,reconciliation
  ${recordedTimings.actualDur},${recordedTimings.baseDur},${recordedTimings.reconciliation}`);
    // Reset timings
    recordedTimings.startTime = startTime;
    recordedTimings.actualDur = 0;
    recordedTimings.baseDur = 0;
    recordedTimings.reconciliation = 0;
  } else {
    // Add timings
    recordedTimings.actualDur += actualDuration;
    recordedTimings.baseDur += baseDuration;
    recordedTimings.reconciliation += reconciliationTime;
  }
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
  }
  const plugin = new ConnectionForwarder(plugins);
  initialiseStore(plugin);
  const store = getStore();
  const { toggle, dark } = React.useContext(ThemeContext);
  applyTheme(dark ? darkTheme : lightTheme);

  return (
    <BaseUrlContext.Provider value={baseUrl}>
      <BrowserRouter>
        <Provider store={store}>
          <div className="App">
            <button type="button" onClick={toggle}>
              Toggle Theme
            </button>
            <ActionButton
              positionStyle={{
                position: "relative",
                height: "30px",
                width: "100px",
                margin: "auto",
                padding: "",
                border: "",
                minWidth: "",
                maxWidth: ""
              }}
              text="Main Menu"
              actions={{
                executeAsOne: false,
                actions: [
                  {
                    type: OPEN_PAGE,
                    openPageInfo: {
                      location: "app",
                      page: "menu",
                      macros: "{}"
                    }
                  }
                ]
              }}
            />
            <Profiler id="Dynamic Page Profiler" onRender={onRenderCallback}>
              <DynamicPageWidget
                routePath="app"
                positionStyle={{
                  position: "relative",
                  height: "",
                  width: "",
                  margin: "",
                  padding: "",
                  border: "",
                  minWidth: "",
                  maxWidth: ""
                }}
              />
            </Profiler>
          </div>
        </Provider>
      </BrowserRouter>
    </BaseUrlContext.Provider>
  );
};

export default App;
