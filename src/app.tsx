import React, { Profiler } from "react";
import "./app.css";
import { Provider } from "react-redux";
import { BrowserRouter, Redirect, Switch } from "react-router-dom";
import { getStore, initialiseStore } from "./redux/store";
import log, { LogLevelDesc } from "loglevel";
import { lightTheme, darkTheme, ThemeContext } from "./themeContext";
import { SimulatorPlugin } from "./connection/sim";
import { ConiqlPlugin } from "./connection/coniql";
import { ConnectionForwarder } from "./connection/forwarder";
import { Connection } from "./connection/plugin";
import { EmbeddedDisplay } from "./ui/widgets";
import { BaseUrlContext } from "./baseUrl";
import { onRenderCallback } from "./profilerCallback";
import { RelativePosition } from "./types/position";
import { Header } from "./ui/components/Header/header";
import { Footer } from "./ui/components/Footer/footer";

const baseUrl = process.env.REACT_APP_BASE_URL ?? "http://localhost:3000";
const SIMULATION_TIME = parseFloat(
  process.env.REACT_APP_SIMULATION_TIME ?? "100"
);
const THROTTLE_PERIOD = parseFloat(
  process.env.REACT_APP_THROTTLE_PERIOD ?? "100"
);
const CONIQL_SOCKET = process.env.REACT_APP_CONIQL_SOCKET;

log.setLevel((process.env.REACT_APP_LOG_LEVEL as LogLevelDesc) ?? "info");

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
  if (CONIQL_SOCKET !== undefined) {
    const coniql = new ConiqlPlugin(CONIQL_SOCKET);
    plugins.unshift(["pva://", coniql]);
    plugins.unshift(["ca://", coniql]);
    plugins.unshift(["ssim://", coniql]);
  }
  const plugin = new ConnectionForwarder(plugins);
  initialiseStore(plugin, THROTTLE_PERIOD);
  const store = getStore();
  const { dark } = React.useContext(ThemeContext);
  applyTheme(dark ? darkTheme : lightTheme);

  return (
    <BaseUrlContext.Provider value={baseUrl}>
      <BrowserRouter>
        <Switch>
          <Redirect
            exact
            from="/"
            to={
              "/" +
              encodeURIComponent(
                JSON.stringify({
                  app: {
                    filename: "home",
                    filetype: "json",
                    macros: {}
                  }
                })
              )
            }
          />
          <Provider store={store}>
            <div className="App">
              <Header />
              <Profiler id="Dynamic Page Profiler" onRender={onRenderCallback}>
                <EmbeddedDisplay
                  position={new RelativePosition()}
                  file="app.json"
                  filetype="json"
                  defaultProtocol="pva"
                />
              </Profiler>
              <Footer />
            </div>
          </Provider>
        </Switch>
      </BrowserRouter>
    </BaseUrlContext.Provider>
  );
};

export default App;
