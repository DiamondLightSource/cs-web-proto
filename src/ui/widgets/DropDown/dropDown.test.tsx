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

  test("details node opens on click", (): void => {
    const { getByRole, getByText } = render(grouping);
    // Content text there even when closed.
    expect(getByText("Test Text")).toBeInTheDocument();
    const dropDown = getByRole("group");
    expect(dropDown).not.toHaveAttribute("open");
    fireEvent.click(dropDown);
    // Wait for the event loop.
    waitFor(() => expect(dropDown).toHaveAttribute("open"));
  });
});
