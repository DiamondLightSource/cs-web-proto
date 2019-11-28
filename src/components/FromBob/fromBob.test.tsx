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
    jest
      .spyOn(global, "fetch")
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

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith("TestFile");

    process.nextTick((): void => {
      // 6
      console.log(wrapper.debug());
      expect(wrapper.type()).toEqual(Display);

      global.fetch.mockClear(); // 7
      done(); // 8
    });
  });
});
