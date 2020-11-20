import React from "react";
import { fireEvent } from "@testing-library/react";

import { OPEN_WEBPAGE, WidgetAction } from "../../widgets/widgetActions";
import { Widget } from "../../widgets/widget";
import { RelativePosition } from "../../../types/position";
import { contextRender } from "../../../setupTests";

// Mock the useHistory hook
jest.mock("react-router-dom", (): object => ({
  useHistory: (): object => ({
    push: jest.fn()
  })
}));

// Clear the window.open mock (set up in setupTests.ts).
afterEach((): void => {
  (window.open as jest.Mock).mockClear();
});

const BBC_ACTION: WidgetAction = {
  type: OPEN_WEBPAGE,
  openWebpageInfo: { url: "https://bbc.co.uk", description: "BBC" }
};

test("context menu opens on right click and executes action if clicked", async () => {
  // Add key attribute to suppress React warning about children.
  const contents = (): JSX.Element => <div key="0">Hello</div>;
  const { queryByText } = contextRender(
    <Widget
      actions={{
        actions: [BBC_ACTION],
        executeAsOne: false
      }}
      baseWidget={contents}
      position={new RelativePosition()}
    ></Widget>
  );

  expect(queryByText("Hello")).toBeInTheDocument();
  // Click the button
  fireEvent.contextMenu(queryByText("Hello") as HTMLDivElement);
  expect(queryByText("BBC")).toBeInTheDocument();
  // Click the menu item.
  fireEvent.click(queryByText("BBC") as HTMLDivElement);
  expect(window.open).toBeCalled();
});

test("context menu cancels on click elsewhere in document", async () => {
  // Add key attribute to suppress React warning about children.
  const contents = (): JSX.Element => <div key="0">Hello</div>;
  const { queryByText, container } = contextRender(
    <Widget
      actions={{
        actions: [BBC_ACTION],
        executeAsOne: false
      }}
      baseWidget={contents}
      position={new RelativePosition()}
    ></Widget>
  );

  expect(queryByText("Hello")).toBeInTheDocument();
  // Click the button
  fireEvent.contextMenu(queryByText("Hello") as HTMLDivElement);
  expect(queryByText("BBC")).toBeInTheDocument();
  // Cancel by clicking elsewhere.
  fireEvent.mouseDown(container);
  expect(queryByText("BBC")).not.toBeInTheDocument();
});
