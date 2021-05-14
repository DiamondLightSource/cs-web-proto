import React from "react";
import { useConnection } from "./useConnection";
import { contextRender, ddouble } from "../../testResources";
import { DType } from "../../types/dtypes";
import { CsState } from "../../redux/csState";

// Helper component to allow calling the useConnection hook.
const ConnectionTester = (props: { pvName?: string }): JSX.Element => {
  const [effectivePvName, connected, readonly, value] = useConnection(
    "dummyid",
    props.pvName
  );
  return (
    <div>
      <div>effective pv name: {effectivePvName}</div>
      <div>connected: {connected.toString()}</div>
      <div>readonly: {readonly.toString()}</div>
      <div>value: {value?.toString()}</div>
    </div>
  );
};

// Helper function to create CsState object.
function getConnectionState(pvName: string, value: DType): CsState {
  return {
    valueCache: {
      [pvName]: {
        value: value,
        connected: true,
        readonly: false,
        initializingPvName: pvName
      }
    },
    subscriptions: { [pvName]: [] },
    globalMacros: {},
    effectivePvNameMap: {},
    deviceCache: {}
  };
}

describe("useConnection", (): void => {
  it("returns null values if pvName undefined", (): void => {
    const initialState = getConnectionState("ca://PV1", ddouble(0));
    const { getByText } = contextRender(
      <ConnectionTester />,
      {},
      {},
      initialState
    );
    expect(getByText("connected: false")).toBeInTheDocument();
  });
  it("returns values if pvName defined", (): void => {
    const PV_NAME = "ca://PV1";
    const initialState = getConnectionState("ca://PV1", ddouble(0));
    const { getByText } = contextRender(
      <ConnectionTester pvName={PV_NAME} />,
      {},
      {},
      initialState
    );
    expect(getByText("connected: true")).toBeInTheDocument();
    expect(getByText("readonly: false")).toBeInTheDocument();
    expect(getByText("value: DType: 0")).toBeInTheDocument();
  });
});
