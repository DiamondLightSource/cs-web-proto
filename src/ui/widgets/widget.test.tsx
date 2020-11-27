import React from "react";

import { Widget } from "./widget";
import { LabelComponent } from "./Label/label";
import { RelativePosition } from "../../types/position";
import { PV } from "../../types/pv";
import { contextRender } from "../../setupTests";
import { fireEvent, waitFor } from "@testing-library/react";
import copyToClipboard from "clipboard-copy";

const PV_NAME = "ca://pv";

// Mock copy-to-clipboard function.
// See https://remarkablemark.org/blog/2018/06/28/jest-mock-default-named-export/
jest.mock("clipboard-copy", (): object => {
  return {
    __esModule: true,
    default: jest.fn()
  };
});
const TestLabel = (): JSX.Element => {
  return <LabelComponent text="Test" />;
};

describe("<Widget />", (): void => {
  test("it shows label text", (): void => {
    const { queryByText } = contextRender(
      <Widget baseWidget={TestLabel} position={new RelativePosition()} />
    );
    expect(queryByText("Test")).toBeInTheDocument();
  });

  test("it loads TooltipWrapper on middle click", async (): Promise<void> => {
    // We have to provide a valid subscriptions dict otherwise
    // we get an error when the widget comes to unsubscribe.
    const initialCsState = {
      effectivePvNameMap: {},
      globalMacros: {},
      subscriptions: { [PV_NAME]: [] },
      valueCache: {},
      deviceCache: {},
      deviceSubscriptions: {}
    };

    const { getByText } = contextRender(
      <Widget
        pvName={new PV(PV_NAME)}
        baseWidget={TestLabel}
        position={new RelativePosition()}
        tooltip="hi there"
      />,
      {},
      {},
      initialCsState
    );
    const label = getByText("Test");
    // simulate middle click
    fireEvent.mouseDown(label, { button: 1 });
    await waitFor((): void => {
      expect(getByText(/.*hi.*/)).toBeInTheDocument();
      expect(copyToClipboard).toHaveBeenCalledWith("ca://pv");
    });
  });
});
