import React from "react";
import { WidgetFromBob } from "./fromBob";
import { shallow } from "enzyme";

import { Display } from "../Display/display";

describe("<WidgetFromBob>", (): void => {
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

    const wrapper = shallow(
      <WidgetFromBob
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
});
