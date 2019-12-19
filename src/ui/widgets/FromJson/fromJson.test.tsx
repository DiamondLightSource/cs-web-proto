import React from "react";
import { WidgetFromJson } from "./fromJson";
import { shallow } from "enzyme";

import { Display } from "../Display/display";
import { Label } from "../Label/label";
import { DEFAULT_BASE_URL } from "../../../baseUrl";

beforeEach((): void => {
  const useEffect = jest.spyOn(React, "useEffect");
  const mockUseEffect = (): void => {
    useEffect.mockImplementationOnce((f): any => f());
  };

  mockUseEffect();
});

describe("<WidgetFromJson>", (): void => {
  it.each<any>([
    ["TestFile", `${DEFAULT_BASE_URL}/json/TestFile`],
    ["https://a.com/b.json", "https://a.com/b.json"]
  ] as [string, string][])(
    "fetches a file from the server",
    (
      inputFile: string,
      resolvedFile: string,
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

      // Just call the function, throw away the result
      shallow(
        <WidgetFromJson
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
        />
      );

      expect(globalWithFetch.fetch).toHaveBeenCalledTimes(1);
      expect(globalWithFetch.fetch).toHaveBeenCalledWith(resolvedFile);

      process.nextTick((): void => {
        globalWithFetch.fetch.mockClear(); // 7
        done(); // 8
      });
    }
  );

  it("fetches converts to JSON", (done): void => {
    const mockSuccessResponse = { type: "display", position: "relative" };
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
      <WidgetFromJson
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
      />
    );

    expect(globalWithFetch.fetch).toHaveBeenCalledTimes(1);
    expect(globalWithFetch.fetch).toHaveBeenCalledWith(
      `${DEFAULT_BASE_URL}/json/TestFile`
    );

    process.nextTick((): void => {
      // 6
      expect(wrapper.type()).toEqual(Display);

      globalWithFetch.fetch.mockClear(); // 7
      done(); // 8
    });
  });

  it("fetches converts children to JSON", (done): void => {
    const mockSuccessResponse = {
      type: "display",
      position: "relative",
      children: [{ type: "label", position: "relative", text: "Test" }]
    };
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
      <WidgetFromJson
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
      />
    );

    expect(globalWithFetch.fetch).toHaveBeenCalledTimes(1);
    expect(globalWithFetch.fetch).toHaveBeenCalledWith(
      `${DEFAULT_BASE_URL}/json/TestFile`
    );

    process.nextTick((): void => {
      // 6
      expect(wrapper.type()).toEqual(Display);
      expect(wrapper.childAt(0).type()).toEqual(Label);

      globalWithFetch.fetch.mockClear(); // 7
      done(); // 8
    });
  });
});
