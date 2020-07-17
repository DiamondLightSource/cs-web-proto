import React, { Profiler } from "react";
import "./app.css";
import { Provider } from "react-redux";
import { BrowserRouter, Redirect, Switch } from "react-router-dom";
import { store } from "./redux/store";
import log, { LogLevelDesc } from "loglevel";
import { lightTheme, darkTheme, ThemeContext } from "./themeContext";
import { EmbeddedDisplay } from "./ui/widgets";
import { BaseUrlContext } from "./baseUrl";
import { onRenderCallback } from "./profilerCallback";
import { RelativePosition } from "./types/position";
import { Header } from "./ui/components/Header/header";
import { Footer } from "./ui/components/Footer/footer";

const baseUrl = process.env.REACT_APP_BASE_URL ?? "http://localhost:3000";

log.setLevel((process.env.REACT_APP_LOG_LEVEL as LogLevelDesc) ?? "info");

function applyTheme(theme: any): void {
  Object.keys(theme).forEach(function(key): void {
    const value = theme[key];
    document.documentElement.style.setProperty(key, value);
  });
}

const App: React.FC = (): JSX.Element => {
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
