import React from "react";
import { contextRender } from "../../testResources";
import { DType } from "../../types/dtypes";
import { CsState } from "../../redux/csState";
import { useDevice } from "./useDevice";

const DeviceTester = (props: { device?: string }): JSX.Element => {
  const description = useDevice(props.device || "");
  return <div>{description?.value?.stringValue || "not defined"}</div>;
};

function getConnectionState(): CsState {
  return {
    valueCache: {},
    subscriptions: {},
    globalMacros: {},
    effectivePvNameMap: {},
    deviceCache: { testDevice: new DType({ stringValue: "42" }) }
  };
}

describe("useDevice", (): void => {
  it("returns undefined if device not in cache", (): void => {
    const initialState = getConnectionState();
    const { getByText } = contextRender(<DeviceTester />, {}, {}, initialState);
    expect(getByText("not defined")).toBeInTheDocument();
  });

  it("returns description if device in cache", (): void => {
    const initialState = getConnectionState();
    const { getByText } = contextRender(
      <DeviceTester device={"testDevice"} />,
      {},
      {},
      initialState
    );
    expect(getByText("42")).toBeInTheDocument();
  });
});
