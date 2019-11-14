// Special-case filename App.tsx is permitted.
/* eslint unicorn/filename-case: 0 */ // --> OFF

import React from "react";
import "./App.css";
import { Provider } from "react-redux";
import { BrowserRouter, Link, Route } from "react-router-dom";
import { getStore, initialiseStore } from "./redux/store";
import log from "loglevel";
import { lightTheme, darkTheme, ThemeContext } from "./themeContext";
import { SimulatorPlugin } from "./connection/sim";
import { ConiqlPlugin } from "./connection/coniql";
import { ConnectionForwarder } from "./connection/forwarder";
import { WidgetFromJson } from "./components/FromJson/fromJson";
import { withRouter } from "react-router-dom";

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
  var coniql;
  if (settings.coniqlSocket !== undefined) {
    coniql = new ConiqlPlugin(settings.coniqlSocket);
  } else {
    coniql = undefined;
  }
  const fallbackPlugin = simulator;
  const plugin = new ConnectionForwarder([
    ["sim://", simulator],
    ["loc://", simulator],
    ["pva://", coniql],
    ["", fallbackPlugin]
  ]);
  initialiseStore(plugin);
  const store = getStore();
  const { toggle, dark } = React.useContext(ThemeContext);
  applyTheme(dark ? darkTheme : lightTheme);

  const styleLinkButton = {
    margin: "10px 10px"
  };

  return (
    <Provider store={store}>
      <div className="App">
        <button type="button" onClick={toggle}>
          Toggle Theme
        </button>
        <div
          className="top"
          id="Links"
          style={{ position: "relative", display: "block" }}
        >
          - Top -
          <WidgetFromJson
            file="http://localhost:3000/shapesPage.json"
            containerStyling={{
              position: "relative",
              height: "",
              width: "",
              margin: "",
              padding: "",
              border: ""
            }}
          />
          <Link style={styleLinkButton} to="/">
            Home
          </Link>
          <Link style={styleLinkButton} to="/left/examplePage/{}">
            Simple example
          </Link>
          <Link style={styleLinkButton} to="/right/progressPage/{}">
            Progress
          </Link>
          <Link style={styleLinkButton} to="/left/ionpExample/{}">
            Positioning
          </Link>
          <Link style={styleLinkButton} to="/right/simple/{}">
            Simple
          </Link>
          <Link style={styleLinkButton} to="/left/coniqlPage/{}">
            Coniql
          </Link>
          <Link style={styleLinkButton} to="/right/flexiblePage/{}">
            Flex
          </Link>
          <Link style={styleLinkButton} to="/left/flexiEmbedded/{}">
            Embed
          </Link>
          <Link style={styleLinkButton} to="/right/shapesPage/{}">
            Shapes
          </Link>
          <Link
            style={styleLinkButton}
            to='/left/ionpExample/{"device":"TEST-DEVICE-LEFT"}'
          >
            Nested Left
          </Link>
          <Link
            style={styleLinkButton}
            to='/right/ionpExample/{"device":"TEST-DEVICE-RIGHT"}'
          >
            Nested Right
          </Link>
          <Link style={styleLinkButton} to="/left/graphics/{}">
            Graphics
          </Link>
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
  );
};

export default withRouter(App);
