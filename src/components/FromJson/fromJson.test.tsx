import React from "react";
import { WidgetFromJson } from "./fromJson";
import { shallow } from "enzyme";

import { Display } from "../Display/display";
import { Label } from "../Label/label";

describe("<WidgetFromJson>", (): void => {
  it("fetches a file from the server", (done): void => {
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
          padding: ""
        }}
        file="TestFile"
      />
    );

    expect(globalWithFetch.fetch).toHaveBeenCalledTimes(1);
    expect(globalWithFetch.fetch).toHaveBeenCalledWith("TestFile");

    process.nextTick((): void => {
      globalWithFetch.fetch.mockClear(); // 7
      done(); // 8
    });
  });

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
          padding: ""
        }}
        file="TestFile"
      />
    );

    expect(globalWithFetch.fetch).toHaveBeenCalledTimes(1);
    expect(globalWithFetch.fetch).toHaveBeenCalledWith("TestFile");

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
          padding: ""
        }}
        file="TestFile"
      />
    );

    expect(globalWithFetch.fetch).toHaveBeenCalledTimes(1);
    expect(globalWithFetch.fetch).toHaveBeenCalledWith("TestFile");

    process.nextTick((): void => {
      // 6
      expect(wrapper.type()).toEqual(Display);
      expect(wrapper.childAt(0).type()).toEqual(Label);

      globalWithFetch.fetch.mockClear(); // 7
      done(); // 8
    });
  });
});
