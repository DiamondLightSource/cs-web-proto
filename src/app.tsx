import React, { Profiler, useState } from "react";
import "./app.css";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import log, { LogLevelDesc } from "loglevel";
import { lightTheme, darkTheme, ThemeContext } from "./themeContext";
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
            <Header />
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
            <Footer />
          </div>
        </Provider>
      </BaseUrlContext.Provider>
    </FileContext.Provider>
  );
};

export default App;
