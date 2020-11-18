// React testing library extensions to expect().
import "@testing-library/jest-dom/extend-expect";
import { configure } from "enzyme";
import log from "loglevel";
import Adapter from "enzyme-adapter-react-16";
import { DType, DAlarm } from "./types/dtypes";
import { FileProvider, PageState, TabState } from "./fileContext";
import { render, RenderResult } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { MacroContext } from "./types/macros";
import { csReducer, CsState } from "./redux/csState";
import { createStore } from "redux";
import { BrowserRouter as Router } from "react-router-dom";

// Set up Enzyme.
configure({ adapter: new Adapter() });

log.setLevel("info");

// Plotly expects this function to exist but it doesn't
// when testing.
if (typeof window.URL.createObjectURL === "undefined") {
  Object.defineProperty(window.URL, "createObjectURL", { value: () => {} });
}

// Mock window.open
window.open = jest.fn();

// Helper functions for dtypes.
export function ddouble(
  doubleValue: number,
  alarm: DAlarm = DAlarm.NONE
): DType {
  return new DType({ doubleValue: doubleValue }, alarm);
}

export function ddoubleArray(
  arrayValue: number[],
  alarm: DAlarm = DAlarm.NONE
): DType {
  return new DType({ arrayValue: Float64Array.from(arrayValue) }, alarm);
}

export function dstring(
  stringValue: string,
  alarm: DAlarm = DAlarm.NONE
): DType {
  return new DType({ stringValue: stringValue }, alarm);
}

// Helper function for rendering with a working fileContext.
export function contextRender(
  component: JSX.Element,
  initialPageState: PageState = {},
  initialTabState: TabState = {},
  initialCsState: CsState = {
    effectivePvNameMap: {},
    globalMacros: {},
    subscriptions: {},
    valueCache: {}
  }
): RenderResult {
  const ParentComponent = (props: { child: JSX.Element }): JSX.Element => {
    // Hard-code macros for now.
    // eslint-disable-next-line no-template-curly-in-string
    const contextMacros = { a: "A", b: "B", c: "C", e: "${a}" };
    const globalMacros = { c: "D", d: "E" };
    initialCsState.globalMacros = globalMacros;
    const macroContext = { macros: contextMacros, updateMacro: (): void => {} };
    const store = createStore<CsState, any, any, any>(
      csReducer,
      initialCsState
    );
    return (
      <Router>
        <Provider store={store}>
          <MacroContext.Provider value={macroContext}>
            <FileProvider
              initialPageState={initialPageState}
              initialTabState={initialTabState}
            >
              {props.child}
            </FileProvider>
          </MacroContext.Provider>
        </Provider>
      </Router>
    );
  };
  return render(<ParentComponent child={component}></ParentComponent>);
}
