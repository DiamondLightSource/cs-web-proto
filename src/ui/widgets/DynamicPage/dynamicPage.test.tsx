import React, * as ReactAll from "react";

import { render, waitFor } from "@testing-library/react";
import { DynamicPageComponent } from "./dynamicPage";
import { FileContext, FileContextType } from "../../../fileContext";
import { Provider } from "react-redux";
import { store } from "../../../redux/store";

interface GlobalFetch extends NodeJS.Global {
  fetch: any;
}
const globalWithFetch = global as GlobalFetch;
jest.spyOn(ReactAll, "useEffect").mockImplementation((f): any => f());

beforeEach((): void => {
  // Ensure the fetch() function mock is always cleared.
  jest.spyOn(globalWithFetch, "fetch").mockClear();
});

describe("<DynamicPage>", (): void => {
  it("loads a page", () => {
    const mockSuccessResponse =
      '{"type": "display", "position": "relative", "children": [ { "type": "label", "position": "relative", "text": "hello" } ] }';
    const mockJsonPromise = Promise.resolve(mockSuccessResponse);
    const mockFetchPromise = Promise.resolve({
      text: (): Promise<{}> => mockJsonPromise
    });
    jest
      .spyOn(globalWithFetch, "fetch")
      .mockImplementation((): Promise<{}> => mockFetchPromise);

    const fileContext: FileContextType = {
      pageState: {
        testlocation: {
          path: "test.json",
          type: "json",
          macros: {},
          defaultProtocol: "pva"
        }
      },
      tabState: {},
      addPage: () => {},
      removePage: () => {},
      addTab: () => {},
      removeTab: () => {},
      selectTab: () => {}
    };
    const { queryByText } = render(
      <Provider store={store}>
        <FileContext.Provider value={fileContext}>
          <DynamicPageComponent location="testlocation" />
        </FileContext.Provider>
      </Provider>
    );

    expect(queryByText("hello")).not.toBeInTheDocument();

    expect(globalWithFetch.fetch).toHaveBeenCalledTimes(1);
    expect(globalWithFetch.fetch).toHaveBeenCalledWith(
      "http://localhost:3000/json/test.json"
    );

    waitFor((): void => {
      expect(queryByText("hello")).toBeInTheDocument();
    });
  });
});
