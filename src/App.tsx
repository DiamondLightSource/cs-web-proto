// Specifically disable some eslint rules
/* eslint unicorn/filename-case: 0 */ // --> OFF

import React from "react";
import "./App.css";
import { Provider } from "react-redux";
import { BrowserRouter, Link, Route } from "react-router-dom";
import { FrontPage } from "./pages/frontpage";
import { InputsPage } from "./pages/inputsPage";
import { ReadbacksPage } from "./pages/readbacksPage";
import { ProgressPage } from "./pages/progressPage";
import { PositioningExamplePage } from "./pages/positioningExamplePage";
import { ConiqlPage } from "./pages/coniqlPage";
import { getStore, initialiseStore } from "./redux/store";
import { ConiqlPlugin } from "./connection/coniql";

const SOCKET = "localhost:8000";

const App: React.FC = (): JSX.Element => {
  const plugin = new ConiqlPlugin(SOCKET);
  initialiseStore(plugin);
  const store = getStore();

  const styleLinkButton = {
    backgroundColor: "#eeeeee",
    margin: "10px 10px"
  };

  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="App">
          <h1>CS Web Proto</h1>
          <div id="Links" style={{ margin: "5px" }}>
            <Link style={styleLinkButton} to="/">
              Home
            </Link>
            <Link style={styleLinkButton} to="/inputs">
              Inputs
            </Link>
            <Link style={styleLinkButton} to="/readbacks">
              Readbacks
            </Link>
            <Link style={styleLinkButton} to="/progress">
              Progress
            </Link>
            <Link style={styleLinkButton} to="/positioning">
              Positioning
            </Link>
            <Link style={styleLinkButton} to="/coniql">
              Coniql
            </Link>
          </div>
          <div
            id="Central Column"
            style={{
              width: "600px",
              height: "800px",
              border: "solid 3px #dddddd",
              margin: "auto"
            }}
          >
            <Route path="/" exact component={FrontPage} />
            <Route path="/inputs" exact component={InputsPage} />
            <Route path="/readbacks" exact component={ReadbacksPage} />
            <Route path="/progress" exact component={ProgressPage} />
            <Route
              path="/positioning"
              exact
              component={PositioningExamplePage}
            />
            <Route path="/coniql" exact component={ConiqlPage} />
          </div>
        </div>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
