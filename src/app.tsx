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
  TabState,
  FileDescription,
  PageState,
  addPage,
  removePage,
  removeTab,
  addTab,
  selectTab
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

  const [pages, setPages] = useState<PageState>({
    app: {
      path: "home.json",
      type: "json",
      macros: {},
      defaultProtocol: "pva"
    }
  });
  const [tabs, setTabs] = useState<TabState>({});
  const fileContext: FileContextType = {
    pages,
    tabs,
    addPage: (location: string, fileDesc: FileDescription) => {
      setPages(addPage(pages, location, fileDesc));
    },
    removePage: (location: string, fileDesc?: FileDescription) => {
      setPages(removePage(pages, location, fileDesc));
    },
    addTab: (location: string, tabName: string, fileDesc: FileDescription) => {
      setTabs(addTab(tabs, location, tabName, fileDesc));
    },
    removeTab: (location: string, fileDesc: FileDescription) => {
      setTabs(removeTab(tabs, location, fileDesc));
    },
    selectTab: (location: string, tabName: string) => {
      setTabs(selectTab(tabs, location, tabName));
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
