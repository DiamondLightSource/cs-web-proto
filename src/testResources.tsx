import React from "react";
import { DType, DAlarm } from "./types/dtypes";
import { FileProvider, PageState, TabState } from "./fileContext";
import { render, RenderResult } from "@testing-library/react";
import { Provider } from "react-redux";
import { MacroContext } from "./types/macros";
import { csReducer, CsState } from "./redux/csState";
import { createStore } from "redux";
import { BrowserRouter as Router } from "react-router-dom";
import {
  OPEN_WEBPAGE,
  WidgetAction,
  WritePv,
  WRITE_PV
} from "./ui/widgets/widgetActions";

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

// Test actions
export const WRITE_PV_ACTION: WritePv = {
  type: WRITE_PV,
  writePvInfo: {
    pvName: "PV",
    value: "value",
    description: "write value to PV"
  }
};

export const WRITE_PV_ACTION_NO_DESC: WritePv = {
  type: WRITE_PV,
  writePvInfo: {
    pvName: "PV",
    value: "value"
  }
};

export const OPEN_BBC_ACTION: WidgetAction = {
  type: OPEN_WEBPAGE,
  openWebpageInfo: { url: "https://bbc.co.uk", description: "BBC" }
};

export const ACTIONS_EX_AS_ONE = {
  actions: [WRITE_PV_ACTION, WRITE_PV_ACTION_NO_DESC],
  executeAsOne: true
};

export const ACTIONS_EX_FIRST = {
  actions: [WRITE_PV_ACTION, WRITE_PV_ACTION_NO_DESC],
  executeAsOne: false
};

// Helper function for rendering with a working fileContext.
export function contextRender(
  component: JSX.Element,
  initialPageState: PageState = {},
  initialTabState: TabState = {},
  initialCsState: CsState = {
    effectivePvNameMap: {},
    globalMacros: {},
    subscriptions: {},
    valueCache: {},
    deviceCache: {}
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
