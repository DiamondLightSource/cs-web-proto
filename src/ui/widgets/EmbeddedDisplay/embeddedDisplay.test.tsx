import React, * as ReactAll from "react";
import log from "loglevel";
import { EmbeddedDisplay } from "./embeddedDisplay";

import { DEFAULT_BASE_URL } from "../../../baseUrl";
import { RelativePosition } from "../../../types/position";
import { contextRender } from "../../../setupTests";
import { waitFor } from "@testing-library/react";

// Ensure that all widgets are registered by importing
// from src/ui/wigets/index.ts, which in turn imports
// all the widgets.
import { Label } from "..";
// We need to use the import for it to take effect.
log.debug(Label.name);
interface GlobalFetch extends NodeJS.Global {
  fetch: any;
}
const globalWithFetch = global as GlobalFetch;
jest.spyOn(ReactAll, "useEffect").mockImplementation((f): any => f());

beforeEach((): void => {
  // Ensure the fetch() function mock is always cleared.
  jest.spyOn(globalWithFetch, "fetch").mockClear();
});

describe("<EmbeddedDisplay>", (): void => {
  it.each<any>([
    ["TestFile.bob", `${DEFAULT_BASE_URL}/bob/TestFile.bob`],
    ["https://a.com/b.bob", "https://a.com/b.bob"],
    ["TestFile.json", `${DEFAULT_BASE_URL}/json/TestFile.json`],
    ["https://a.com/b.json", "https://a.com/b.json"],
    ["TestFile.opi", `${DEFAULT_BASE_URL}/opi/TestFile.opi`],
    ["https://a.com/b.opi", "https://a.com/b.opi"]
  ] as [string, string][])(
    "fetches a file from the server",
    async (inputFile: string, resolvedFile: string): Promise<void> => {
      const mockSuccessResponse = {};
      const mockTextPromise = Promise.resolve(mockSuccessResponse);
      const mockFetchPromise = Promise.resolve({
        text: (): Promise<{}> => mockTextPromise
      });
      jest
        .spyOn(globalWithFetch, "fetch")
        .mockImplementation((): Promise<{}> => mockFetchPromise);

      // Suppress logging for expected error.
      log.setLevel("error");
      const { queryByText } = contextRender(
        <EmbeddedDisplay
          position={new RelativePosition()}
          file={{
            path: inputFile,
            defaultProtocol: "ca",
            macros: {}
          }}
        />
      );

      expect(globalWithFetch.fetch).toHaveBeenCalledTimes(1);
      expect(globalWithFetch.fetch).toHaveBeenCalledWith(resolvedFile);

      await waitFor((): void =>
        expect(queryByText(/Error converting.*/)).toBeInTheDocument()
      );
      log.setLevel("info");
    }
  );
  it("returns an error label when embedding a widget only", async (): Promise<
    void
  > => {
    const mockSuccessResponse = `
    <widget type="label" version="2.0.0">
        <name>Label</name>
        <text>From .bob file</text>
        <x>30</x>
        <y>10</y>
        <width>140</width>
    </widget>`;
    const mockTextPromise = Promise.resolve(mockSuccessResponse);
    const mockFetchPromise = Promise.resolve({
      text: (): Promise<{}> => mockTextPromise
    });

    jest
      .spyOn(globalWithFetch, "fetch")
      .mockImplementation((): Promise<{}> => mockFetchPromise);

    // Suppress logging for expected error.
    log.setLevel("error");
    const { queryByText } = contextRender(
      <EmbeddedDisplay
        position={new RelativePosition()}
        file={{
          path: "TestFile.bob",
          defaultProtocol: "ca",
          macros: {}
        }}
      />,
      {},
      {}
    );

    expect(globalWithFetch.fetch).toHaveBeenCalledTimes(1);
    expect(globalWithFetch.fetch).toHaveBeenCalledWith(
      `${DEFAULT_BASE_URL}/bob/TestFile.bob`
    );

    await waitFor((): void =>
      expect(queryByText(/Error converting.*/)).toBeInTheDocument()
    );
    log.setLevel("info");
  });

  it("converts a display with child widget", async (): Promise<void> => {
    const mockSuccessResponse = `
    <?xml version="1.0" encoding="UTF-8"?>
    <display version="2.0.0">
        <name>Display</name>
        <width>200</width>
        <height>350</height>
        <widget type="label" version="2.0.0">
            <name>Label</name>
            <text>From .bob file</text>
            <x>30</x>
            <y>10</y>
            <width>140</width>
        </widget>
    </display>`;
    const mockTextPromise = Promise.resolve(mockSuccessResponse);
    const mockFetchPromise = Promise.resolve({
      text: (): Promise<{}> => mockTextPromise
    });

    jest
      .spyOn(globalWithFetch, "fetch")
      .mockImplementation((): Promise<{}> => mockFetchPromise);

    const { queryByText } = contextRender(
      <EmbeddedDisplay
        position={new RelativePosition()}
        file={{
          path: "TestFile.bob",
          defaultProtocol: "ca",
          macros: {}
        }}
      />,
      {},
      {}
    );

    expect(globalWithFetch.fetch).toHaveBeenCalledTimes(1);
    expect(globalWithFetch.fetch).toHaveBeenCalledWith(
      `${DEFAULT_BASE_URL}/bob/TestFile.bob`
    );

    await waitFor((): void =>
      expect(queryByText("From .bob file")).toBeInTheDocument()
    );
  });

  it("converts fetched children to JSON", async (): Promise<void> => {
    const mockSuccessResponse =
      '{ "type": "display", "position": "relative", "children": [{ "type": "label", "position": "relative", "text": "Test" }] }';
    const mockJsonPromise = Promise.resolve(mockSuccessResponse);
    const mockFetchPromise = Promise.resolve({
      text: (): Promise<{}> => mockJsonPromise
    });

    jest
      .spyOn(globalWithFetch, "fetch")
      .mockImplementation((): Promise<{}> => mockFetchPromise);

    const { queryByText } = contextRender(
      <EmbeddedDisplay
        position={new RelativePosition()}
        file={{
          path: "TestFile.json",
          defaultProtocol: "ca",
          macros: {}
        }}
      />,
      {},
      {}
    );

    expect(globalWithFetch.fetch).toHaveBeenCalledTimes(1);
    expect(globalWithFetch.fetch).toHaveBeenCalledWith(
      `${DEFAULT_BASE_URL}/json/TestFile.json`
    );

    await waitFor((): void => expect(queryByText("Test")).toBeInTheDocument());
  });
});
