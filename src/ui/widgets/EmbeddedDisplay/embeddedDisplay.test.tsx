import React from "react";
import log from "loglevel";
import { EmbeddedDisplay } from "./embeddedDisplay";

import { RelativePosition } from "../../../types/position";
import { contextRender } from "../../../testResources";
import { waitFor } from "@testing-library/react";
import { ensureWidgetsRegistered } from "..";
ensureWidgetsRegistered();

interface GlobalFetch extends NodeJS.Global {
  fetch: any;
}
const globalWithFetch = global as GlobalFetch;

beforeEach((): void => {
  // Ensure the fetch() function mock is always cleared.
  jest.spyOn(globalWithFetch, "fetch").mockClear();
});

describe("<EmbeddedDisplay>", (): void => {
  it.each<any>([
    ["/TestFile.bob", "/TestFile.bob"],
    ["https://a.com/b.bob", "https://a.com/b.bob"],
    ["/json/TestFile.json", "/json/TestFile.json"],
    ["https://a.com/b.json", "https://a.com/b.json"],
    ["/TestFile.opi", "/TestFile.opi"],
    ["https://a.com/b.opi", "https://a.com/b.opi"]
  ] as [string, string][])(
    "fetches a file from the server",
    async (inputFile: string, resolvedFile: string): Promise<void> => {
      const mockSuccessResponse = {};
      const mockTextPromise = Promise.resolve(mockSuccessResponse);
      const mockFetchPromise = Promise.resolve({
        text: (): Promise<unknown> => mockTextPromise
      });
      jest
        .spyOn(globalWithFetch, "fetch")
        .mockImplementation((): Promise<unknown> => mockFetchPromise);

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
        expect(queryByText(/Error parsing.*/)).toBeInTheDocument()
      );
      log.setLevel("info");
    }
  );
  it("returns an error label when embedding a widget only", async (): Promise<void> => {
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
      text: (): Promise<unknown> => mockTextPromise
    });

    jest
      .spyOn(globalWithFetch, "fetch")
      .mockImplementation((): Promise<unknown> => mockFetchPromise);

    // Suppress logging for expected error.
    log.setLevel("error");
    const { queryByText } = contextRender(
      <EmbeddedDisplay
        position={new RelativePosition()}
        file={{
          path: "/TestFile1.bob",
          defaultProtocol: "ca",
          macros: {}
        }}
      />,
      {},
      {}
    );

    expect(globalWithFetch.fetch).toHaveBeenCalledTimes(1);
    expect(globalWithFetch.fetch).toHaveBeenCalledWith("/TestFile1.bob");

    await waitFor((): void =>
      expect(queryByText(/Error parsing.*/)).toBeInTheDocument()
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
      text: (): Promise<unknown> => mockTextPromise
    });

    jest
      .spyOn(globalWithFetch, "fetch")
      .mockImplementation((): Promise<unknown> => mockFetchPromise);

    const { queryByText } = contextRender(
      <EmbeddedDisplay
        position={new RelativePosition()}
        file={{
          path: "/TestFile2.bob",
          defaultProtocol: "ca",
          macros: {}
        }}
      />,
      {},
      {}
    );

    expect(globalWithFetch.fetch).toHaveBeenCalledTimes(1);
    expect(globalWithFetch.fetch).toHaveBeenCalledWith("/TestFile2.bob");

    await waitFor((): void =>
      expect(queryByText("From .bob file")).toBeInTheDocument()
    );
  });

  it("converts fetched children to JSON", async (): Promise<void> => {
    const mockSuccessResponse =
      '{ "type": "display", "position": "relative", "children": [{ "type": "label", "position": "relative", "text": "Test" }] }';
    const mockJsonPromise = Promise.resolve(mockSuccessResponse);
    const mockFetchPromise = Promise.resolve({
      text: (): Promise<unknown> => mockJsonPromise
    });

    jest
      .spyOn(globalWithFetch, "fetch")
      .mockImplementation((): Promise<unknown> => mockFetchPromise);

    const { queryByText } = contextRender(
      <EmbeddedDisplay
        position={new RelativePosition()}
        file={{
          path: "/TestFile3.json",
          defaultProtocol: "ca",
          macros: {}
        }}
      />,
      {},
      {}
    );

    expect(globalWithFetch.fetch).toHaveBeenCalledTimes(1);
    expect(globalWithFetch.fetch).toHaveBeenCalledWith("/TestFile3.json");

    await waitFor((): void => expect(queryByText("Test")).toBeInTheDocument());
  });
});
