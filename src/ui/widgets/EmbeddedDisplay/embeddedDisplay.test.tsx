import React from "react";
import { EmbeddedDisplay } from "./embeddedDisplay";
import { shallow } from "enzyme";

import { Display } from "../Display/display";
import { Label } from "../Label/label";
import { DEFAULT_BASE_URL } from "../../../baseUrl";

const useEffect = jest.spyOn(React, "useEffect");
const mockUseEffect = (): void => {
  useEffect.mockImplementationOnce((f): any => f());
};

beforeEach((): void => {
  mockUseEffect();
});

describe("<EmbeddedDisplay>", (): void => {
  it.each<any>([
    ["TestFile", `${DEFAULT_BASE_URL}/bob/TestFile`, "bob"],
    ["https://a.com/b.bob", "https://a.com/b.bob", "bob"],
    ["TestFile", `${DEFAULT_BASE_URL}/json/TestFile`, "json"],
    ["https://a.com/b.json", "https://a.com/b.json", "json"]
  ] as [string, string, string][])(
    "fetches a file from the server",
    (
      inputFile: string,
      resolvedFile: string,
      filetype: string,
      done: jest.DoneCallback
    ): void => {
      const mockSuccessResponse = {};
      const mockJsonPromise = Promise.resolve(mockSuccessResponse);
      const mockFetchPromise = Promise.resolve({
        json: (): Promise<{}> => mockJsonPromise
      });

      // Hack to satisfy typescript
      interface GlobalFetch extends NodeJS.Global {
        fetch: any;
      }
      const globalWithFetch = global as GlobalFetch;

      jest
        .spyOn(global as GlobalFetch, "fetch")
        .mockImplementation((): Promise<{}> => mockFetchPromise);

      const wrapper = shallow(
        <EmbeddedDisplay
          containerStyling={{
            position: "relative",
            height: "",
            width: "",
            margin: "",
            padding: "",
            border: "",
            minWidth: "",
            maxWidth: ""
          }}
          file={inputFile}
          filetype={filetype}
        />
      );

      expect(globalWithFetch.fetch).toHaveBeenCalledTimes(1);
      expect(globalWithFetch.fetch).toHaveBeenCalledWith(resolvedFile);

      process.nextTick((): void => {
        // 6
        expect(wrapper.type()).toEqual(Display);

        globalWithFetch.fetch.mockClear(); // 7
        done(); // 8
      });
    }
  );
  it("converts a simple widget", (done): void => {
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

    // Hack to satisfy typescript
    interface GlobalFetch extends NodeJS.Global {
      fetch: any;
    }
    const globalWithFetch = global as GlobalFetch;

    jest
      .spyOn(global as GlobalFetch, "fetch")
      .mockImplementation((): Promise<{}> => mockFetchPromise);

    const wrapper = shallow(
      <EmbeddedDisplay
        containerStyling={{
          position: "relative",
          height: "",
          width: "",
          margin: "",
          padding: "",
          border: "",
          minWidth: "",
          maxWidth: ""
        }}
        file="TestFile"
        filetype="bob"
      />
    );

    expect(globalWithFetch.fetch).toHaveBeenCalledTimes(1);
    expect(globalWithFetch.fetch).toHaveBeenCalledWith(
      `${DEFAULT_BASE_URL}/bob/TestFile`
    );

    process.nextTick((): void => {
      // 6
      expect(wrapper.type()).toEqual(Label);

      globalWithFetch.fetch.mockClear(); // 7
      done(); // 8
    });
  });

  it("converts a display with child widget", (done): void => {
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

    // Hack to satisfy typescript
    interface GlobalFetch extends NodeJS.Global {
      fetch: any;
    }
    const globalWithFetch = global as GlobalFetch;

    jest
      .spyOn(global as GlobalFetch, "fetch")
      .mockImplementation((): Promise<{}> => mockFetchPromise);

    const wrapper = shallow(
      <EmbeddedDisplay
        containerStyling={{
          position: "relative",
          height: "",
          width: "",
          margin: "",
          padding: "",
          border: "",
          minWidth: "",
          maxWidth: ""
        }}
        file="TestFile"
        filetype="bob"
      />
    );

    expect(globalWithFetch.fetch).toHaveBeenCalledTimes(1);
    expect(globalWithFetch.fetch).toHaveBeenCalledWith(
      `${DEFAULT_BASE_URL}/bob/TestFile`
    );

    process.nextTick((): void => {
      // 6
      expect(wrapper.type()).toEqual(Display);
      expect(wrapper.childAt(0).type()).toEqual(Display);
      expect(
        wrapper
          .childAt(0)
          .childAt(0)
          .type()
      ).toEqual(Label);

      globalWithFetch.fetch.mockClear(); // 7
      done(); // 8
    });
  });

  it("converts fetched children to JSON", (done): void => {
    const mockSuccessResponse =
      '{ "type": "display", "position": "relative", "children": [{ "type": "label", "position": "relative", "text": "Test" }] }';
    const mockJsonPromise = Promise.resolve(mockSuccessResponse);
    const mockFetchPromise = Promise.resolve({
      text: (): Promise<{}> => mockJsonPromise
    });

    // Hack to satisfy typescript
    interface GlobalFetch extends NodeJS.Global {
      fetch: any;
    }
    const globalWithFetch = global as GlobalFetch;

    jest
      .spyOn(global as GlobalFetch, "fetch")
      .mockImplementation((): Promise<{}> => mockFetchPromise);

    const wrapper = shallow(
      <EmbeddedDisplay
        containerStyling={{
          position: "relative",
          height: "",
          width: "",
          margin: "",
          padding: "",
          border: "",
          minWidth: "",
          maxWidth: ""
        }}
        file="TestFile"
        filetype="json"
      />
    );

    expect(globalWithFetch.fetch).toHaveBeenCalledTimes(1);
    expect(globalWithFetch.fetch).toHaveBeenCalledWith(
      `${DEFAULT_BASE_URL}/json/TestFile`
    );

    process.nextTick((): void => {
      // 6
      expect(wrapper.type()).toEqual(Display);
      // Why the nesting?
      expect(
        wrapper
          .childAt(0)
          .childAt(0)
          .type()
      ).toEqual(Label);

      globalWithFetch.fetch.mockClear(); // 7
      done(); // 8
    });
  });
});
