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

const App: React.FC = (): JSX.Element => {
  // Set dark or light mode using ThemeContext
  const { dark, applyTheme } = React.useContext(ThemeContext);
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
    // Each instance of context provider allows child components to access
    // the properties on the object placed in value
    // Profiler sends render information whenever child components rerender
    <FileContext.Provider value={fileContext}>
      <BaseUrlContext.Provider value={baseUrl}>
        <Provider store={store}>
          <div className="App">
            <Header />
            <Profiler id="Dynamic Page Profiler" onRender={onRenderCallback}>
              <EmbeddedDisplay
                // RelativePosition returns CSS properties
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
