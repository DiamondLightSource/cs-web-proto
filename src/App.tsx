// Special-case filename App.tsx is permitted.
/* eslint unicorn/filename-case: 0 */ // --> OFF

import React from "react";
import "./App.css";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { getStore, initialiseStore } from "./redux/store";
import log from "loglevel";
import { lightTheme, darkTheme, ThemeContext } from "./themeContext";
import { SimulatorPlugin } from "./connection/sim";
import { ConiqlPlugin } from "./connection/coniql";
import { ConnectionForwarder } from "./connection/forwarder";
import { WidgetFromJson } from "./components/FromJson/fromJson";
import { Connection } from "./connection/plugin";

var settings: any;
try {
  // Use require so that we can catch this error
  settings = require("./settings");
} catch (e) {
  settings = {};
}

log.setLevel("warn");

function applyTheme(theme: any): void {
  Object.keys(theme).forEach(function(key): void {
    const value = theme[key];
    document.documentElement.style.setProperty(key, value);
  });
}

const App: React.FC = (): JSX.Element => {
  const simulator = new SimulatorPlugin();
  const fallbackPlugin = simulator;
  const plugins: [string, Connection][] = [
    ["sim://", simulator],
    ["loc://", simulator],
    ["", fallbackPlugin]
  ];
  if (settings.coniqlSocket !== undefined) {
    const coniql = new ConiqlPlugin(settings.coniqlSocket);
    plugins.push(["pva://", coniql]);
  }
  const plugin = new ConnectionForwarder(plugins);
  initialiseStore(plugin);
  const store = getStore();
  const { toggle, dark } = React.useContext(ThemeContext);
  applyTheme(dark ? darkTheme : lightTheme);

  return (
    <BrowserRouter>
      <Provider store={store}>
        <div className="App">
          <button type="button" onClick={toggle}>
            Toggle Theme
          </button>
          <div className="top" id="Links">
            <WidgetFromJson
              file="http://localhost:3000/synoptic.json"
              containerStyling={{
                position: "relative",
                height: "",
                width: "",
                margin: "",
                padding: "",
                border: ""
              }}
            />
          </div>
          <div
            style={{ position: "relative", display: "block" }}
            id="Dynamic Pages"
          >
            <WidgetFromJson
              containerStyling={{
                position: "relative",
                height: "100%",
                width: "100%",
                border: "3px solid #ccc",
                margin: "",
                padding: ""
              }}
              file="http://localhost:3000/splitPage.json"
            />
          </div>
        </div>
      </Provider>
    </BrowserRouter>
  );
};

export default App;
