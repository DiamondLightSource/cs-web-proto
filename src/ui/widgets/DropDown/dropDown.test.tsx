import React from "react";
import { create } from "react-test-renderer";

import { DropDownComponent } from "./dropDown";
import { fireEvent, render, waitFor } from "@testing-library/react";

const grouping = (
  <DropDownComponent title={"Test"}>Test Text</DropDownComponent>
);

describe("<DropDownComponent />", (): void => {
  test("it matches the snapshot", (): void => {
    const snapshot = create(grouping);
    expect(snapshot.toJSON()).toMatchSnapshot();
  });

  test("details node opens on click", async (): Promise<void> => {
    const { getByRole, getByText } = render(grouping);
    // Content text there even when closed.
    expect(getByText("Test Text")).toBeInTheDocument();
    const dropDown = getByRole("group") as HTMLDetailsElement;
    expect(dropDown.open).not.toBe(true);
    // Click needs to be on summary element rather than details element.
    const summary = getByText("Test");
    fireEvent.click(summary);
    // Wait for the event loop.
    await waitFor(() => expect(dropDown.open).toBe(true));
  });
});
