import React from "react";
import { fireEvent } from "@testing-library/react";

import { Widget } from "../../widgets/widget";
import { RelativePosition } from "../../../types/position";
import { contextRender, OPEN_BBC_ACTION } from "../../../testResources";
import * as ReactRouter from "react-router";

// Important to mock at the source (react-router) rather than somewhere
// it is re-exported (react-router-dom).
// https://stackoverflow.com/questions/53162001/typeerror-during-jests-spyon-cannot-set-property-getrequest-of-object-which
jest.spyOn(ReactRouter, "useHistory").mockImplementation(jest.fn());

// Clear the window.open mock (set up in setupTests.ts).
afterEach((): void => {
  (window.open as jest.Mock).mockClear();
});

test("context menu opens on right click and executes action if clicked", async () => {
  // Add key attribute to suppress React warning about children.
  const contents = (): JSX.Element => <div key="0">Hello</div>;
  const { queryByText } = contextRender(
    <Widget
      actions={{
        actions: [OPEN_BBC_ACTION],
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
        actions: [OPEN_BBC_ACTION],
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
