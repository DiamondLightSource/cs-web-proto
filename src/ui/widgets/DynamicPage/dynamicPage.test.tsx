import React, * as ReactAll from "react";
import log from "loglevel";

import { waitFor } from "@testing-library/react";
import { DynamicPageComponent } from "./dynamicPage";
import { PageState } from "../../../fileContext";
import { contextRender } from "../../../setupTests";

// Import display widget to ensure that it is registered.
import { Display } from "..";
log.debug(Display.name);

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
  it("shows placeholder if no page is loaded", () => {
    const { queryByText } = contextRender(
      <DynamicPageComponent location="testlocation" />,
      {},
      {}
    );
    expect(queryByText(/.*no file loaded/)).toBeInTheDocument();
  });

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

    const initialPageState: PageState = {
      testlocation: {
        path: "test.json",
        type: "json",
        macros: {},
        defaultProtocol: "pva"
      }
    };
    const { queryByText } = contextRender(
      <DynamicPageComponent location="testlocation" />,
      initialPageState
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
