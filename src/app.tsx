import React, { Profiler } from "react";
import "./app.css";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import log, { LogLevelDesc } from "loglevel";
import { lightTheme, darkTheme, ThemeContext } from "./themeContext";
import { EmbeddedDisplay } from "./ui/widgets";
import { BaseUrlContext } from "./baseUrl";
import { onRenderCallback } from "./profilerCallback";
import { RelativePosition } from "./types/position";
import { Header } from "./ui/components/Header/header";
import { Footer } from "./ui/components/Footer/footer";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";

const baseUrl = process.env.REACT_APP_BASE_URL ?? "http://localhost:3000";

log.setLevel((process.env.REACT_APP_LOG_LEVEL as LogLevelDesc) ?? "info");

const LoadEmbedded = (): JSX.Element => {
  let match = useRouteMatch();
  let type = "json";
  let path = match.url;
  if (match.url.endsWith(".opi")) {
    type = "opi";
  } else if (match.url.endsWith(".json")) {
    type = "json";
  } else if (match.url.endsWith(".bob")) {
    type = "bob";
  } else {
    path = `${match.url}.json`;
  }

  return (
    <EmbeddedDisplay
      position={new RelativePosition()}
      file={{
        path,
        type,
        defaultProtocol: "pva",
        macros: {}
      }}
    />
  );
};

const App: React.FC = (): JSX.Element => {
  // Set dark or light mode using ThemeContext
  const { dark, applyTheme } = React.useContext(ThemeContext);
  applyTheme(dark ? darkTheme : lightTheme);

  return (
    // Each instance of context provider allows child components to access
    // the properties on the object placed in value
    // Profiler sends render information whenever child components rerender
    <BaseUrlContext.Provider value={baseUrl}>
      <Provider store={store}>
        <div className="App">
          <Header />
          <Profiler id="Dynamic Page Profiler" onRender={onRenderCallback}>
            <Switch>
              <Redirect exact from="/" to="/app" />
              <Route path="/*">
                <LoadEmbedded />
              </Route>
            </Switch>
          </Profiler>
          <Footer />
        </div>
      </Provider>
    </BaseUrlContext.Provider>
  );
};

export default App;
