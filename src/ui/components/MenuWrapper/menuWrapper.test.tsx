import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";

import { MenuWrapper } from "./menuWrapper";
import { OPEN_WEBPAGE, WidgetAction } from "../../widgets/widgetActions";

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

test("menu wrapper opens on middle click and executes action if clicked", async () => {
  const contents = <div>Hello</div>;
  const { queryByText } = render(
    <MenuWrapper
      pvName="hello"
      actions={{
        actions: [BBC_ACTION],
        executeAsOne: false
      }}
    >
      {[contents]}
    </MenuWrapper>
  );

  expect(queryByText("Hello")).toBeInTheDocument();
  // Click the button
  fireEvent.contextMenu(queryByText("Hello") as HTMLDivElement);
  // Wait for the menu to appear.
  await waitFor((): void => {
    expect(queryByText("BBC")).toBeInTheDocument();
    fireEvent.click(queryByText("BBC") as HTMLDivElement);
    expect(window.open).toBeCalled();
  });
});
