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
  TabState,
  PageState,
  createFileContext
} from "./fileContext";
import { Header } from "./ui/components/Header/header";
import { Footer } from "./ui/components/Footer/footer";

const baseUrl = process.env.REACT_APP_BASE_URL ?? "http://localhost:3000";

log.setLevel((process.env.REACT_APP_LOG_LEVEL as LogLevelDesc) ?? "info");

/* Page that will be loaded at start. */
const INITIAL_PAGE_STATE: PageState = {
  app: {
    path: "home.json",
    type: "json",
    macros: {},
    defaultProtocol: "pva"
  }
};

const App: React.FC = (): JSX.Element => {
  // Set dark or light mode using ThemeContext
  const { dark, applyTheme } = React.useContext(ThemeContext);
  applyTheme(dark ? darkTheme : lightTheme);

  // Set up the file context, which contains information about
  // the open pages in DynamicPages and tabs in DynamicTabs.
  const [pageState, setPageState] = useState<PageState>(INITIAL_PAGE_STATE);
  const [tabState, setTabState] = useState<TabState>({});
  const fileContext = createFileContext(
    pageState,
    setPageState,
    tabState,
    setTabState
  );

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
