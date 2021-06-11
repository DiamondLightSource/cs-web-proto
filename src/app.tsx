import React, { Profiler } from "react";
import "./app.css";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import log, { LogLevelDesc } from "loglevel";
import { EmbeddedDisplay } from "./ui/widgets";
import { onRenderCallback } from "./profilerCallback";
import { RelativePosition } from "./types/position";
import { Header } from "./ui/components/Header/header";
import { Footer } from "./ui/components/Footer/footer";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import { PerformancePage } from "./ui/components/PerformancePage/performancePage";

log.setLevel((process.env.REACT_APP_LOG_LEVEL as LogLevelDesc) ?? "info");

const LoadEmbedded = (): JSX.Element => {
  const match = useRouteMatch();
  let path = match.url;
  if (
    !match.url.endsWith(".opi") ||
    match.url.endsWith(".json") ||
    match.url.endsWith(".bob")
  ) {
    path = `${match.url}.json`;
  }

  return (
    <EmbeddedDisplay
      position={new RelativePosition()}
      file={{
        path,
        defaultProtocol: "pva",
        macros: {}
      }}
    />
  );
};

const App: React.FC = (): JSX.Element => (
  // Each instance of context provider allows child components to access
  // the properties on the object placed in value
  // Profiler sends render information whenever child components rerender
  <Provider store={store}>
    <div className="App">
      <Profiler id="Dynamic Page Profiler" onRender={onRenderCallback}>
        <Switch>
          <Redirect exact from="/" to="/app" />
          <Route exact path="/performance">
            <Header drawer={false} />
            <PerformancePage />
          </Route>
          <Route path="/*">
            <Header drawer={true} />
            <LoadEmbedded />
          </Route>
        </Switch>
      </Profiler>
      <Footer />
    </div>
  </Provider>
);

export default App;
