// React testing library extensions to expect().
import "@testing-library/jest-dom/extend-expect";
// Set up Enzyme.
import { configure } from "enzyme";
import log from "loglevel";
import Adapter from "enzyme-adapter-react-16";
import { DType, DAlarm } from "./types/dtypes";
import {
  createFileContext,
  FileContext,
  PageState,
  TabState
} from "./fileContext";
import { render, RenderResult } from "@testing-library/react";
import React, { useState } from "react";
import { Provider } from "react-redux";
import { store } from "./redux/store";
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
export function fileContextRender(
  component: JSX.Element,
  initialPageState: PageState,
  initialTabState: TabState
): RenderResult {
  const ParentComponent = (props: { child: JSX.Element }): JSX.Element => {
    const [pageState, setPageState] = useState<PageState>(initialPageState);
    const [tabState, setTabState] = useState<TabState>(initialTabState);
    const fileContext = createFileContext(
      pageState,
      setPageState,
      tabState,
      setTabState
    );
    return (
      <Provider store={store}>
        <FileContext.Provider value={fileContext}>
          {props.child}
        </FileContext.Provider>
      </Provider>
    );
  };
  return render(<ParentComponent child={component}></ParentComponent>);
}